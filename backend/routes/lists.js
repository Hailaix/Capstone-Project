/** Routes for reading lists */

const express = require('express');
const db = require('../../../express-jobly/db');
const router = express.Router();
const List = require('../models/list');

//for validation
const jsonschema = require('jsonschema');
const listNewSchema = require('../schema/listNew.json');
const { BadRequestError } = require('../expressError');

/** GET / Returns a list of every reading list in the db, newest first */
router.get('/', async function (req, res, next) {
    try {
        const lists = await List.getAll();
        return res.json({ lists });
    } catch (e) {
        return next(e);
    }
});

/** GET /:id  Returns info on a given list */
router.get('/:id', async function (req, res, next) {
    try {
        const list = await List.get(req.params.id);
        return res.json( { list });
    } catch (e) {
        return next(e);
    }
});

/** POST / add a new reading list to the database*/
router.post('/', async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, listNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const list = await List.addList(req.body);
        return res.status(201).json({ list });
    } catch (e) {
        return next(e);
    }
})

module.exports = router;