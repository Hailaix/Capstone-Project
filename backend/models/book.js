
const db = require('../db');
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../expressError');

/** related functions for books */
class Book {

    /** Create a Book from provided data 
     *  data is { book_id, title, author, link }
     * 
     *  Returns { book_id, title, author, link }
     *  Throws BadRequestError if book already in db
    */
    static async addBook({ book_id, title, author, link }) {
        //check for duplication
        const dupecheck = await db.query(`
        SELECT book_id
        FROM books
        WHERE book_id = $1`,
            [book_id]);

        if (dupecheck.rows[0]) throw new BadRequestError(`Book ${book_id} already in db`);

        //if the id isn't a duplicate, add it to the db
        const res = await db.query(`
        INSERT INTO books
        (book_id, title, author, link)
        VALUES ($1,$2,$3,$4)
        RETURNING book_id, title, author, link`,
            [book_id, title, author, link]);

        const book = res.rows[0];
        return book;
    }

    /** retrieve information on a book from the database on book_id
     *  
     *  Returns { book_id, title, author, link}
     *  Throws NotFoundError if book not in db
     */
    static async get(book_id) {
        const res = await db.query(`
        SELECT book_id, title, author, link
        FROM books
        WHERE book_id = $1`,
        [book_id]);

        if(!res.rows[0]) throw new NotFoundError(`No such book with id ${book_id}`);

        return res.rows[0];
    }

}

module.exports = Book;