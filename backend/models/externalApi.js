/** functions related to the google books API */

const axios = require('axios');
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

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

    const book = res.rows[0];
    //split authors back into an array
    book.authors = book.authors.split(',');
    return res.rows[0];
};

/** Search the API for books matching the provided search terms
 *  Returns a list of books that match
 */
async function search( offset = 0) {
    /** Helper function that constructs the query parameters of the request based on the search terms */
    const constructParams = () => {

    }
}

module.exports = {
    addBookFromAPI
}