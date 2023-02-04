CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  description TEXT,
  cover TEXT,
  link TEXT
);

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  bio TEXT
);

CREATE TABLE reviews (
  list_id TEXT REFERENCES reading_lists ON DELETE CASCADE,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  title TEXT,
  body TEXT,
  PRIMARY KEY (list_id, username)
);

CREATE TABLE reading_lists (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT
);

CREATE TABLE books_lists (
    list_id INTEGER REFERENCES reading_lists ON DELETE CASCADE,
    book_id TEXT REFERENCES books ON DELETE CASCADE,
    PRIMARY KEY (list_id, book_id)
);
