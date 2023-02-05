/** Express middleware for authentication */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('./config');
const { UnauthorizedError } = require('./expressError');

/** authenticates JWT tokens attached to request and stores the token's payload on res.locals
 *  Code from express jobly project
 */
function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader;
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch (err) {
        return next();
    }
}

/** express middleware to ensure that a user has been added to res.locals */
function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (e) {
        return next(e);
    }
}

/** express middleware to ensure that the user token matches the username in the route params */
function ensureCorrectUser(req, res, next) {
    try {
        const user = res.locals.user;
        if (!(user && user.username === req.params.username)) {
            throw new UnauthorizedError();
        }
    } catch (e) {
        return next(e);
    }
}

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureCorrectUser
}