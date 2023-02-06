const db = require('../db');
const { NotFoundError, BadRequestError } = require('../expressError');

class Review {
    /** Get all reviews for a specified list */
    static async getAll(list_id) {
        const res = await db.query(`
        SELECT username, rating, title, body
        FROM reviews
        WHERE list_id = $1`,
            [list_id]);

        return res.rows;
    }

    /** Adds a review of the specified list by the specified user to the db
     *  a user can only have a single review of a list
     *  Throws NotFoundError on missing list or user, BadRequestError on duplicate review
     *  {list_id, username, review} => {list_id, username, rating, title, body}
     *  where review is { rating, title, body}
     */
    static async addReview(list_id, username, { rating, title, body }) {

        //first, check if the reading list exists
        const listcheck = await db.query(`
        SELECT list_id
        FROM reading_lists
        WHERE list_id = $1`,
            [list_id]);
        if (!listcheck.rows[0]) throw new NotFoundError('no such list');

        //next, check if the username exists
        const usercheck = await db.query(`
        SELECT username
        FROM users
        WHERE username = $1`,
            [username]);
        if (!usercheck.rows[0]) throw new NotFoundError('no such user');

        //finally, check to make sure that this user has not left a review already
        const dupecheck = await db.query(`
        SELECT list_id, username
        FROM reviews
        WHERE list_id = $1 AND username = $2`,
            [list_id, username]);
        if (dupecheck.rows[0]) throw new BadRequestError(`${username} has already reviewed this list`);

        //if all of the above works out, add the review to the db
        const res = await db.query(`
        INSERT INTO reviews
        (list_id, username, rating, title, body)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING list_id, username, rating, title, body`,
            [list_id, username, rating, title, body]);

        return res.rows[0];
    }

    /** Remove a review of the specified list by the specified user */
    static async remove(list_id, username) {
        const res = await db.query(`
        DELETE FROM reviews
        WHERE list_id = $1 AND username = $2
        RETURNING list_id, username`,
            [list_id, username]);
        if (!res.rows[0]) throw new NotFoundError('no such review');
    }

    /** Edit a review of a specified list by a specified user
     *  data can be any parts of { rating, title, body }
     */
    static async edit(list_id, username, data) {
        //first, get the column names of the fields to be updated in the db
        const keys = Object.keys(data);
        //if no data is being provided, throw a BadRequestError
        if (keys.length === 0) throw new BadRequestError("no data to update");

        /** This takes the column name from the key and creates the SET string of every updating column
         *  ex. if data is { rating, title }, cols will be the string 'rating = $1, title = $2'
        */
        const cols = keys.map((col, idx) => (`${col} = $${idx + 1}`)).join(", ");
        //values is the new values being sent to the db
        const values = Object.values(data);

        const res = await db.query(`
        UPDATE reviews
        SET ${cols}
        WHERE list_id = $${values.length + 1} AND username = $${values.length + 2}
        RETURNING list_id, username, rating, title, body`,
        [...values, list_id, username]);
        
        if(!res.rows[0]) throw new NotFoundError(`${username} has not reviewed list ${list_id}`);
        return res.rows[0];
    }
}