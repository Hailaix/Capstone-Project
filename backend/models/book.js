
const db = require('../db');
const {
    NotFoundError,
    BadRequestError,
} = require('../expressError');

/** related functions for books */
class Book {

    /** Create a Book from provided data 
     *  data is { id, title, authors, cover, link }
     *  Where authors is an array of strings
     *  Returns { id, title, authors, cover, link }
     *  Where authors is a string
     *  Throws BadRequestError if book already in db
    */
    static async addBook({ id, title, authors, cover, description, link }) {
        //check for duplication
        const dupecheck = await db.query(`
        SELECT id
        FROM books
        WHERE id = $1`,
            [id]);

        if (dupecheck.rows[0]) throw new BadRequestError(`Book ${book_id} already in db`);

        //convert the authors array into a string seperated by commas
        const joinedAuthors = authors.join(',');

        //if the id isn't a duplicate, add it to the db
        const res = await db.query(`
        INSERT INTO books
        (id, title, authors, cover, description, link)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING id, title, authors, cover, description, link`,
            [id, title, joinedAuthors, cover, description, link]);

        const book = res.rows[0];
        return book;
    }

    /** retrieve information on a book from the database on book_id
     *  
     *  Returns { id, title, authors, cover, description, link}
     *  Where authors is an array of strings,
     *  Throws NotFoundError if book not in db
     */
    static async get(id) {
        const res = await db.query(`
        SELECT id, title, authors, cover, description, link
        FROM books
        WHERE id = $1`,
            [id]);

        if (!res.rows[0]) throw new NotFoundError(`No such book with id ${id}`);

        const book = res.rows[0];

        //separate authors back into an array
        book.authors = book.authors.split(',');

        return book;
    }

    /** retrieve a simplified list of all books in the database
     * 
     * Returns [ { id, title, authors, cover }, ... ]
     */
    static async getAll() {
        const res = await db.query(`
        SELECT id, title, authors, cover
        FROM books
        ORDER BY title`);

        //convert every authors list back into an array
        const books = res.rows.map(book => {
            book.authors = book.authors.split(',');
            return book;
        })
        return books;
    }

}

module.exports = Book;