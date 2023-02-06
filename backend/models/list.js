const db = require('../db');
const { NotFoundError, BadRequestError } = require('../expressError');

const { addBookFromAPI } = require('./externalApi');

/** Functions for lists */
class List {

    /** Add a new list to the db */
    static async addList({ username, title, description = null }) {
        const res = await db.query(`
        INSERT INTO reading_lists
        (username, title, description)
        VALUES ($1,$2,$3)
        RETURNING id, username, title, description`,
            [username, title, description]);

        return res.rows[0];
    }
    /** Retrieve all lists in db, newest first */
    static async getAll() {
        const res = await db.query(`
        SELECT id, username, title, description
        FROM reading_lists
        ORDER BY id DESC`);
        return res.rows;
    }

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
        WHERE id = $1`,
            [list_id]);

        if (!res.rows[0]) throw new NotFoundError(`No list found with id ${list_id}`);

        const list = res.rows[0];
        //if the list does exist, grab some basic info about the books on the list
        const booksRes = await db.query(`
        SELECT b.id, title, authors, cover, description, link
        FROM books b
        JOIN books_lists l
        ON b.id = l.book_id
        WHERE l.list_id = $1`,
            [list_id]);

        list.books = booksRes.rows;

        //and grab the reviews of the list
        const reviewsRes = await db.query(`
        SELECT username, rating, title, body
        FROM reviews
        WHERE list_id = $1`,
            [list_id]);
        list.reviews = reviewsRes.rows;

        return list;
    }

    /** Add a book to a list */
    static async addBook(list_id, book_id) {
        //first check to see if list_id is correct
        const listRes = await db.query(`
        SELECT id
        from reading_lists
        WHERE id = $1`,
            [list_id]);
        if (!listRes.rows[0]) throw new NotFoundError("no such list");

        //then check to see if the book is in the db
        const bookRes = await db.query(`
        SELECT id
        from books
        WHERE id = $1`,
            [book_id]);
        if (!bookRes.rows[0]) {
            //add the book from the api to the db
            //note: any axios errors from the request are uncaught, so they will go straight through
            console.log("attempting to retrieve from API");
            const book = await addBookFromAPI(book_id);
        }

        //finally, check to make sure the book is not already on the list
        const dupecheck = await db.query(`
        SELECT list_id, book_id
        FROM books_lists
        WHERE list_id = $1 AND book_id = $2`,
            [list_id, book_id]);
        if (dupecheck.rows[0]) throw new BadRequestError("That book is already on that list");

        //if all of the above works out, add the book to the list
        const res = await db.query(`
        INSERT INTO books_lists
        (list_id, book_id)
        VALUES ($1, $2)
        RETURNING book_id, list_id`,
            [list_id, book_id]);

        return res.rows[0];
    }


    /** Remove a book from a list */
    static async removeBook(list_id, book_id) {
        const res = await db.query(`
        DELETE FROM books_lists
        WHERE list_id = $1 AND book_id = $2
        RETURNING list_id`,
            [list_id, book_id]);
        if (!res.rows[0]) throw new BadRequestError(`book ${book_id} is not on list ${list_id}`);
    }

    /** Delete a list from db */
    static async remove(id) {
        const res = await db.query(`
        DELETE FROM reading_lists
        WHERE id = $1
        RETURNING id`,
            [id]);
        if (!res.rows[0]) throw new NotFoundError(`no such list`);
    }

    /**TODO */
    /** Edit a list's title and description */
    static async updateList(list_id, title, description) {
        const res = await db.query(`
        UPDATE reading_lists
        SET title = $2, description = $3
        WHERE id = $1
        RETURNING id, title, description`,
            [list_id, title, description]);
        if (!res.rows[0]) throw new NotFoundError(`no such list`);
        return res.rows[0];
    }
}

module.exports = List;