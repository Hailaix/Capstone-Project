/** Routes for users */

const express = require('express');
const router = new express.Router();
const User = require('../models/user');

//authentication middleware
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware');

//for JWT tokens
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

//for validation
const jsonschema = require('jsonschema');
const userRegisterSchema = require('../schema/userRegister.json');
const userLoginSchema = require('../schema/userLogin.json');
const userUpdateSchema = require('../schema/userUpdate.json');
const { BadRequestError } = require('../expressError');

/** Create a JWT for the provided user
 *  For now, just contains the username, may add more as needed
 */
function createToken(user) {
    const payload = {
        username: user.username
    }

    return jwt.sign(payload, SECRET_KEY);
}

/** Post /users/register: { user } => { token }
 *  Where user is { username, password, email }
 *  adds a new user to the db and returns a JWT to authenticate further requests
 *  No auth required
*/
router.post('/register', async function (req, res, next) {
    try {
        //validate the incoming body to make sure it is correctly formatted
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }
        //create a new user in the db with the data, return a JWT of the new user
        const newUser = await User.register(req.body);
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (e) {
        return next(e);
    }
});

/** Post /users/login: { username, password } => { token }
 *  returns a JWT to authenticate further requests
 *  No auth required
 */
router.post('/login', async function (req, res, next) {
    try {
        //validate the login request for formatting
        const validator = jsonschema.validate(req.body, userLoginSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }
        const { username, password } = req.body;
        //ensure the password and username match in db
        const user = await User.authenticate(username, password);
        //return a JWT of the user
        const token = createToken(user);
        return res.json({ token });
    } catch (e) {
        return next(e);
    }
});

/** Get /:username : => { user }
 *  Returns { username, email, bio, lists}
 *  Where lists is [ { list name, list_id }, ... ]
*/
router.get('/:username', ensureLoggedIn, async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({ user });
    } catch (e) {
        return next(e);
    }
});

/** Delete /:username => { deleted: username }
 *  Removes user from db
 *  Auth required: login as :username
 */
router.delete('/:username', ensureCorrectUser, async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({ deleted: req.params.username });
    } catch (e) {
        return next(e);
    }
});

/** PATCH /:username
 *  updates the user info in the db
 *  must be logged in as correct user
 *  returns { username, email, bio }
 */
router.patch('/:username', ensureCorrectUser, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch (e) {
        return next(e);
    }
})

module.exports = router;