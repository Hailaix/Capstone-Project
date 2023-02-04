/** Routes for books */

const express = require('express');
const router = new express.Router();

const Book = require('../models/book');

//for validation
const jsonschema = require('jsonschema');
const bookNewSchema = require('../schema/bookNew.json');
const { BadRequestError } = require('../expressError');

/** Get /books :=> { books: [ { book }, ... ]}
 *  Returns a list of every book in the db
 */
router.get('/', async function (req, res, next) {
    try {
        const books = await Book.getAll();
        return res.json({ books });
    } catch (e) {
        return next(e);
    }
});

/** Get /books/:id :=> { book } 
 *  Returns { id, title, author, cover, link, reviews }
 *  Where reviews is [ {username, title, rating, body }, ... ]
*/
router.get('/:id', async function (req, res, next) {
    try {
        const book = await Book.get(req.params.id);
        return res.json({ book });
    } catch (e) {
        return next(e);
    }
});

/** POST /books { id, title, author, cover, link }
 *  Returns back the book object if it has been successfully added to the db
 */
router.post('/', async function (req, res, next) {
    try {
        //validate the new books data
        const validator = jsonschema.validate(req.body, bookNewSchema);
        if(!validator.valid) {
            const errors = validator.errors.map(e=> e.stack);
            throw new BadRequestError(errors);
        }
        const book = Book.addBook(req.body);
        return res.status(201).json({ book });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;