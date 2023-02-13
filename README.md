# Capstone Project Bookly

This is the final, capstone project of the course.

## Description

This is a simple website that allows users to create and maintain reading lists of books available through google's books API. user's can find new books, read and review other user's lists, and create reading lists of their own.
Uses the [google books API](https://developers.google.com/books) to grab information on individual books.

## To Start

In order to start up the site from this repository, first, create the postgres databases using the files in backend/Database. After database creation, the backend can be run with the command `node server.js` or `nodemon server.js`, which will open up the express server at [http://localhost:5000](http://localhost:5000). The frontend can be started with `npm start` in the bookly directory, which will open the app at [http://localhost:3000](http://localhost:3000).

## Features

1. users can create reading lists, everything on the site revolves around reading lists in some way.
1. users can search the [google books API](https://developers.google.com/books) for books, which they can then add to any reading lists they have created.
1. users can view other user's reading lists, and leave reviews as a form of interaction.
1. users can update their own reading lists by changing the title and description, or by removing or adding new books to them.

## User Flow

Typical user activity would be to either log in or sign up for an account. Once logged in, a user can view a list of all reading lists that have already been created by other users. When viewing a list, they can decide to leave a review explaining how much they liked the list and how they thought the books on it went together. If they enjoy a list, they can view the profile of the user who created it to see other lists that the user has created. If they decide to create their own list, they can do so from their profile page. User's can also view reading lists that they have created from their profile page, and can edit lists with new titles and descriptions, as well as remove books from the list while on the reading list's page. Finally, using the search function, they can add books that they look up to any list that they have created.

## Tech Stack

This website runs off of an express backend communicating with a postgres database, with the frontend being a react app utilizing react router.

### Backend Dependencies

1. `pg` for communicating with the postgres database
1. `axios` for communicating with the google books API
1. `bcrypt` for password encryption
1. `jsonchema` for validating incoming requests
1. `jsonwebtoken` for creating JWTs to authenticate users

### Frontend Dependencies

1. `axios` for communicating with the express backend
1. `bootstrap` for quick styling
1. `html-react-parser` takes a string and parses it into valid react components, used to format the book descriptions
1. `jwt-decode` for decoding information from JWTs coming from the backend
