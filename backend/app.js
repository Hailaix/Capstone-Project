/** Express app for jobly. */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { NotFoundError } = require("./expressError");

const app = express();
const usersRouter = require('./routes/users');
const searchRouter = require('./routes/search');
const listsRouter = require('./routes/lists');

const { authenticateJWT } = require('./middleware');

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

/** extracts jwt token for every incoming request */
app.use(authenticateJWT);

/** App Routers for route subsets */
app.use('/users', usersRouter);
app.use('/search', searchRouter);
app.use('/lists', listsRouter);


/** Handle 404 errors */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
