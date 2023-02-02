
const db = require('../db');
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../expressError');

/** related functions for books */
class Book {

    /** Create a Book from provided data 
     *  data is { book_id, title, authors, cover, link }
     *  Where authors is an array of strings
     *  Returns { book_id, title, authors, cover, link }
     *  Where authors is a string
     *  Throws BadRequestError if book already in db
    */
    static async addBook({ book_id, title, authors, cover, link }) {
        //check for duplication
        const dupecheck = await db.query(`
        SELECT book_id
        FROM books
        WHERE book_id = $1`,
            [book_id]);

        if (dupecheck.rows[0]) throw new BadRequestError(`Book ${book_id} already in db`);

        //convert the authors array into a string seperated by commas
        const joinedAuthors = authors.join(',');

        //if the id isn't a duplicate, add it to the db
        const res = await db.query(`
        INSERT INTO books
        (book_id, title, authors, cover, link)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING book_id, title, authors, cover, link`,
            [book_id, title, joinedAuthors, cover, link]);

        const book = res.rows[0];
        return book;
    }

    /** retrieve information on a book from the database on book_id
     *  
     *  Returns { book_id, title, authors, cover, link, reviews}
     *  Where authors is an array of strings,
     *  Reviews is [ { username, rating, title, body }, ... ]
     *  Throws NotFoundError if book not in db
     */
    static async get(book_id) {
        const res = await db.query(`
        SELECT book_id, title, authors, cover, link
        FROM books
        WHERE book_id = $1`,
        [book_id]);

        if(!res.rows[0]) throw new NotFoundError(`No such book with id ${book_id}`);

        const book = res.rows[0];

        //separate authors back into an array
        book.authors = book.authors.split(',');
        //retrieve the reviews associated with the book in the db and add the array to book
        const reviewRes = await db.query(`
        SELECT username, rating, title, body
        FROM reviews
        WHERE book_id = $1`,
        [book_id]);

        book.reviews = reviewRes.rows;

        return book;
    }

    /** retrieve a simplified list of all books in the database
     * 
     * Returns [ { book_id, title, authors, cover }, ... ]
     */
    static async getAll() {
        const res = await db.query(`
        SELECT book_id, title, authors, cover
        FROM books
        ORDER BY title`);
        
        //convert every authors list back into an array
        const books = res.rows.map( book => {
            book.authors = book.authors.split(',');
            return book;
        })
        return books;
    }

}

module.exports = Book;