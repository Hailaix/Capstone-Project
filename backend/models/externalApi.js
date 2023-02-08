/** functions related to the google books API */

const axios = require('axios');
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

const db = require('../db');
const { BadRequestError } = require('../expressError');

/** Adds a book not currently in the db from the API
     *  Assumes that id is not already in db
     *  Returns { id, title, authors, cover, description, link }
     *  Errors will be uncaught and passed on
     */
async function addBookFromAPI(id) {
    //get the volume info from the API
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    //extract the data we want from what the API gives us
    const { title, authors, description } = data.volumeInfo;
    const cover = data.volumeInfo.imageLinks.thumbnail;
    const link = data.volumeInfo.canonicalVolumeLink;

    //insert the info into the db, converting authors into a string
    const res = await db.query(`
    INSERT INTO books
    (id, title, authors, cover, description, link)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING id, title, authors, cover, description, link`,
        [id, title, authors.join(','), cover, description, link]);

    return res.rows[0];
};

/** Helper function that constructs the query parameters of the request based on the search terms */
const constructParams = (q, intitle, inauthor, isbn, offset) => {
    const params = {
        projection: "lite",
        startIndex: offset,
        fields: 'items(id,volumeInfo/title,volumeInfo/authors,volumeInfo/description,volumeInfo/imageLinks/thumbnail,volumeInfo/canonicalVolumeLink)',
        filter: 'ebooks'
    }
    let qString = q || '*';
    if (intitle) qString += `+intitle:${intitle}`;
    if (inauthor) qString += `+inauthor:${inauthor}`;
    if (isbn) qString += `+isbn:${isbn}`;
    params.q = qString;
    return params;
}

/** Search the API for books matching the provided search terms
 *  Returns a list of books that match
 */
async function searchAPI(q, offset = 0, intitle, inauthor, isbn) {
    //format the query parameters how the API wants them, then send the request
    const params = constructParams(q, intitle, inauthor, isbn, offset);
    console.log(params.q);
    const { data } = await axios.get(BASE_URL, { params });
    //extract an array of just the book info we want from data
    try {
        const books = data.items.map(item => {
            //if there is no thumbnail, just use an empty string
            const thumbnail = item.volumeInfo.imageLinks
                ? item.volumeInfo.imageLinks.thumbnail
                : ''
            const book = {
                id: item.id,
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors,
                cover: thumbnail,
                description: item.volumeInfo.description,
                link: item.volumeInfo.canonicalVolumeLink
            }
            return book;
        });
        return books;
    } catch (e) {
        //this will only fail on a failure to get anything at all back
        throw new BadRequestError("No Results")
    }

}

module.exports = {
    addBookFromAPI,
    searchAPI
}