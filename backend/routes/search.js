/** Search route */

const express = require('express');
const router = new express.Router();

const { searchAPI } = require('../models/externalApi');

/** Sends a search request to the API based on query parameters
 *  Returns a list of books { id, title, authors, cover, description, link }
 */
router.get('/', async function (req, res, next) {
    try {
        const { q, intitle, inauthor, isbn, offset } = req.query;
        const books = await searchAPI(q, offset, intitle, inauthor, isbn);
        return res.json({ books });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;