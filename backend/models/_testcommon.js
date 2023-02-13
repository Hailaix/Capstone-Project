const bcrypt = require('bcrypt');

const db = require('../db');
const { BCRYPT_WORK_FACTOR } = require('../config');

const readinglistIDs = [];

/**Common function that should run before all tests */
async function commonBeforeAll() {
    //empty db, deleting these two tables should cascade to empty the rest of the tables
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM books');
    await db.query('DELETE FROM reading_lists')

    //hash a password to for every user to use
    const hashpass = await bcrypt.hash("password", BCRYPT_WORK_FACTOR);

    //make some users
    await db.query(`
    INSERT INTO users
    (username, password, email, bio)
    VALUES  ('u1', $1, 'u1@email.com', 'u1 bio'),
            ('u2', $1, 'u2@email.com', 'u2 bio'),
            ('u3', $1, 'u3@email.com', 'u3 bio')`,
        [hashpass]);

    //make some books
    await db.query(`
    INSERT INTO books
    (id, title, authors, description, cover, link)
    VALUES  ('fakebook1', 'fakebook1', 'fakeauthor', 'fakedescription', 'fakelink.com/cover1', 'fakelink.com/book1'),
            ('fakebook2', 'fakebook2', 'fakeauthor', 'fakedescription', 'fakelink.com/cover2', 'fakelink.com/book2')`);

    //make a reading list and store the id
    const res = await db.query(`
    INSERT INTO reading_lists
    (username, title, description)
    VALUES ('u1', 'fakereadinglist', 'this is a fake reading list')
    RETURNING id`);
    readinglistIDs.splice(0,0,...res.rows.map(r => r.id));

    //add a book to the reading list
    await db.query(`
    INSERT INTO books_lists
    (list_id, book_id)
    VALUES ($1, 'fakebook1')`,
        [readinglistIDs[0]]);

    //make a review of the reading list
    await db.query(`
    INSERT INTO reviews
    (list_id, username, rating, title, body)
    VALUES ($1, 'u2', 10, 'stellar review', 'what a great list')`,
        [readinglistIDs[0]]);

}

async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {
    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    await db.end();
}

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    readinglistIDs
}