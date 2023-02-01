CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  link TEXT
);

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  bio TEXT
);

CREATE TABLE reviews (
  book_id TEXT REFERENCES books ON DELETE CASCADE,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  title TEXT,
  body TEXT,
  PRIMARY KEY (book_id, username)
);

CREATE TABLE reading_lists (
  list_id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT
);

CREATE TABLE books_on_lists (
    list_id INTEGER REFERENCES reading_lists ON DELETE CASCADE,
    book_id TEXT REFERENCES books ON DELETE CASCADE,
    PRIMARY KEY (list_id, book_id)
);
