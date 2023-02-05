const db = require('../db');
const bcrypt = require('bcrypt');
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require('../config');

/** Everything to do with users in the database */

class User {

    /** authenticate user with username, password.
    *
    * Returns { username }
    *
    * Throws UnauthorizedError is user not found or wrong password.
    **/
    static async authenticate(username, password) {
        //find the user matched to the username provided
        const res = await db.query(`
            SELECT username, password
            FROM users
            WHERE username = $1`,
            [username]
        );
        const user = res.rows[0];
        if (user) { //if we find it, check to see if the passwords match
            const validPass = await bcrypt.compare(password, user.password);
            if (validPass) {
                //if the password is valid, remove the password from the user obj and return it
                delete user.password;
                return user;
            }
        }
        //if we didn't find a user or the password did not match, throw an error
        throw new UnauthorizedError('Invalid username/password');
    }

    /** register user with provided data
     * 
     * Returns { username, bio }
     * 
     * Throws BadRequestError on duplicate username
     */
    static async register({ username, password, email, bio }) {
        //first we check to make sure that username is unique
        const dupeCheck = await db.query(`
            SELECT username
            FROM users
            WHERE username = $1`,
            [username]
        );
        if(dupeCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }
        //hash the password to be put into the db
        const hashpass = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        //insert the new user into the users table and return the new user's info
        const res = await db.query(`
            INSERT INTO users
            (username, password, email, bio)
            VALUES ($1,$2,$3,$4)
            RETURNING username, email, bio`,
            [username, hashpass, email, bio]
        )
        return res.rows[0];
    }

    /** get the list of all users
     * 
     * Returns [{ username, email, bio }, ...]
     */
    static async listAll() {
        const res = await db.query(`
            SELECT username, email, bio
            FROM users
            ORDER BY username`
        );
        return res.rows;
    }

    /** Given a username, retrieve the user's data and lists associated with them
     * 
     * Returns { username, bio, lists }
     *  where lists is [{ list_id, title }]
     */
    static async get(username) {
        //first we retrieve the user from the db
        const res = await db.query(`
        SELECT username, email, bio
        FROM users
        WHERE username = $1`,
        [username]);
        const user = res.rows[0];

        //if the user does not exist, throw an error
        if(!user) throw new NotFoundError(`no such user: ${username}`)

        //otherwise we grab all of the lists associated with the user and add them on
        const lists = await db.query(`
        SELECT list_id, title
        FROM reading_lists
        WHERE username = $1`,
        [username]);
        user.lists = lists.rows;

        return user;
    }

    /** delete the user with username from the db 
     * 
     *  throws an error if the user did not exist, otherwise returns undefined
    */
    static async remove(username) {
        const res = await db.query(`
        DELETE FROM users
        WHERE username = $1
        RETURNING username`,
        [username]);
        if(!res.rows[0]) throw new NotFoundError(`no such user: ${username}`);
    }

    /**TODO edit a user profile */
}

module.exports = User;