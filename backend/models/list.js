const db = require('../db');
const { NotFoundError } = require('../expressError');

/** Functions for lists */
class List {

    /** Retrieve a list by its list_id
     *  Returns { id, username, title, description, books }
     *  Where books is { { book_id, title }, ... }
     *  Throws NotFoundError if there is no list with the provided id in the db
     */
    static async get(list_id) {
        //grab the list from the db
        const res = await db.query(`
        SELECT id, username, title, description
        FROM reading_lists
        WHERE list_id = $1`,
            [list_id]);

        if (!res.rows[0]) throw new NotFoundError(`No list found with id ${list_id}`);

        const list = res.rows[0];
        //if the list does exist, grab some basic info about the books on the list
        const booksRes = await db.query(`
        SELECT b.id, title
        FROM books b
        JOIN books_lists l
        ON b.id = l.book_id
        WHERE l.list_id = $1`,
            [list_id]);

        list.books = booksRes.rows;
        return list;
    }
}