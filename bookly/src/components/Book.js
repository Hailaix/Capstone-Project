import React from "react";
import parse from 'html-react-parser';

const Book = ({ book }) => {
    return (
        <div id={book.id}>
            <img src={book.cover} alt='cover' />
            <h4>{book.title}</h4>
            <h5>authors: {book.authors}</h5>
            <div id="description">
                {parse(book.description)}
            </div>
            <a href={book.link}>link</a>
        </div>
    )
}

export default Book;