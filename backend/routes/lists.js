/** Routes for reading lists */

const express = require('express');
const router = express.Router();
const List = require('../models/list');

//for validation
const jsonschema = require('jsonschema');
const listNewSchema = require('../schema/listNew.json');
const listUpdateSchema = require('../schema/listUpdate.json');
const { BadRequestError, UnauthorizedError } = require('../expressError');
const { ensureLoggedIn } = require('../middleware');

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
router.get('/:id', ensureLoggedIn, async function (req, res, next) {
    try {
        const list = await List.get(req.params.id);
        return res.json({ list });
    } catch (e) {
        return next(e);
    }
});

/** GET /user/:username Returns a list of {id, title} of all reading lists created by the specified user */
router.get('/user/:username', ensureLoggedIn, async function (req, res, next) {
    try {
        const lists = await List.getByUser(req.params.username);
        return res.json({ lists });
    } catch (e) {
        return next(e);
    }
})

/** POST / add a new reading list to the database*/
router.post('/', ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, listNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        req.body.username = res.locals.user.username;
        const list = await List.addList(req.body);
        return res.status(201).json({ list });
    } catch (e) {
        return next(e);
    }
});

/** DELETE /:id delete the specified list
 *  Requires the logged in user to be the owner of the list
 */
router.delete('/:id', ensureLoggedIn, async function (req, res, next) {
    try {
        //grab the list to make sure the logged in user is the owner
        const complist = await List.get(req.params.id);
        if (complist.username !== res.locals.user.username) throw new UnauthorizedError();
        await List.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (e) {
        return next(e);
    }
});

/** PUT /:id update the specified list with a new { title, description } 
 *  Requires the logged in user to be the owner of the list
*/
router.put('/:id', ensureLoggedIn, async function (req, res, next) {
    try {
        //grab the list to make sure the correct user is logged in
        const complist = await List.get(req.params.id);
        if (complist.username !== res.locals.user.username) throw new UnauthorizedError();
        //then validate the body and update the list
        const validator = jsonschema.validate(req.body, listUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const { title, description } = req.body;
        const list = await List.updateList(req.params.id, title, description);
        return res.json({ list });
    } catch (e) {
        return next(e);
    }
});

/** POST /:id/:book_id adds the specified book to the specified list
 *  Requires the logged in user to be the owner of the list
 */
router.post('/:id/books/:book_id', ensureLoggedIn, async function (req, res, next) {
    try {
        //grab the list to make sure the logged in user is the owner
        const complist = await List.get(req.params.id);
        if (complist.username !== res.locals.user.username) throw new UnauthorizedError();

        const addedBook = await List.addBook(req.params.id, req.params.book_id);
        return res.json({ addedBook });
    } catch (e) {
        return next(e);
    }
});

/** DELETE /:id/:book_id removes the specified book from the specified list 
 *  Requires the logged in user to be the owner of the list
*/
router.delete('/:id/books/:book_id', ensureLoggedIn, async function (req, res, next) {
    try {
        //grab the list to make sure the logged in user is the owner
        const complist = await List.get(req.params.id);
        if (complist.username !== res.locals.user.username) throw new UnauthorizedError();

        await List.removeBook(req.params.id, req.params.book_id);
        return res.json({ removed: `book ${req.params.book_id} from list ${req.params.id}` });
    } catch (e) {
        return next(e);
    }
})


module.exports = router;