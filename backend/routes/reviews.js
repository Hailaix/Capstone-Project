/** Routes for reviews @/:list_id/reviews*/

const express = require('express');
const router = new express.Router();
const Review = require('../models/review');

//authentication middleware
const { ensureLoggedIn } = require('../middleware');

//for validation
const jsonschema = require('jsonschema');
const reviewNewSchema = require('../schema/reviewNew.json');
const reviewUpdateSchema = require('../schema/reviewUpdate.json');
const { BadRequestError, UnauthorizedError } = require('../expressError');

/** GET retrieve the list of reviews for the reading list
 *  Returns { reviews : [ {username, rating, title, body }, ...]}
*/
router.get('/:list_id', ensureLoggedIn, async function (req, res, next) {
    try {
        const reviews = await Review.getAll(req.params.list_id);
        return res.json({ reviews });
    } catch (e) {
        return next(e);
    }
});

/** POST post a review of the reading list by the logged in user
 *  Returns { review }
 *  where review is { list_id, username, rating, title, body }
 */
router.post('/:list_id', ensureLoggedIn, async function (req, res, next) {
    try {
        //validate the request body
        const validator = jsonschema.validate(req.body, reviewNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const review = await Review.addReview(req.params.list_id, res.locals.user.username, req.body);
        return res.status(201).json({ review });
    } catch (e) {
        return next(e);
    }
});

/** PATCH edits a review posted by the logged in user on the specified list
 *  Returns { review }
 *  where review is { list_id, username, rating, title, body }
 *  Throws BadRequest on incorrectly formatted body, NotFound if the user has not reviewed the list
 *  and Unauthorized if attempting to edit a review that was not authored by the logged in user
 */
router.patch('/:list_id/:username', ensureLoggedIn, async function (req, res, next) {
    try {
        //if the logged in user is not the author of the review, throw unauth
        if (req.params.username !== res.locals.user.username) throw new UnauthorizedError();
        //validate the request body
        const validator = jsonschema.validate(req.body, reviewUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        //update the review in the db
        const review = await Review.edit(req.params.list_id, req.params.username, req.body);
        return res.json({ review });
    } catch (e) {
        return next(e);
    }
});

/** DELETE removes a review posted by the logged in user on the specified list
 *  Returns { deleted }
 *  Throws Unauthorized on attempting to delete a review not by the logged in user
 *  NotFound on failure to find review
 */
router.delete('/:list_id/:username', ensureLoggedIn, async function (req, res, next) {
    try {
        //if the logged in user is not the author of the review, throw unauth
        if (req.params.username !== res.locals.user.username) throw new UnauthorizedError();
        //delete the review
        await Review.remove(req.params.list_id, req.params.username);
        return res.json({ deleted: `${req.params.username}'s review of list ${req.params.list_id}` });
    } catch (e) {
        return next(e);
    }
})

module.exports = router;