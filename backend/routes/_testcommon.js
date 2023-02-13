const db = require('../db');

const User = require('../models/user');
const List = require('../models/list');
const Review = require('../models/review');

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

const readinglistIDs = [];

async function commonBeforeAll() {
    //empty the db
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM books');
    await db.query('DELETE FROM reading_lists');

    //make some fake books
    await db.query(`
    INSERT INTO books
    (id, title, authors, description, cover, link)
    VALUES  ('fakebook1', 'fakebook1', 'fakeauthor', 'fakedescription', 'fakelink.com/cover1', 'fakelink.com/book1'),
            ('fakebook2', 'fakebook2', 'fakeauthor', 'fakedescription', 'fakelink.com/cover2', 'fakelink.com/book2')`);

    //create test users
    await User.register({
        username: 'u1',
        password: 'password',
        email: 'u1@email.com',
        bio: 'u1 bio'
    });
    await User.register({
        username: 'u2',
        password: 'password',
        email: 'u2@email.com',
        bio: 'u2 bio'
    });
    await User.register({
        username: 'u3',
        password: 'password',
        email: 'u3@email.com',
        bio: 'u3 bio'
    });

    //create test reading list and store the id
    const res = await List.addList({ username: 'u1', title: 'testList', description: 'new test list' });
    readinglistIDs[0] = res.id;

    //add a book to the list
    await List.addBook(readinglistIDs[0], 'fakebook1');

    //make a review of the test list
    await Review.addReview(readinglistIDs[0], 'u2', { rating: 10, title: 'stellar review', body: 'what a great list' });


}

async function commonBeforeEach() {
    await db.query('BEGIN');
}

async function commonAfterEach() {
    await db.query('ROLLBACK');
}

async function commonAfterAll() {
    await db.end();
}

//create tokens for each user
const u1Token = jwt.sign({username: 'u1'}, SECRET_KEY);
const u2Token = jwt.sign({username: 'u2'}, SECRET_KEY);
const u3Token = jwt.sign({username: 'u3'}, SECRET_KEY);


module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    readinglistIDs,
    u1Token,
    u2Token,
    u3Token
}