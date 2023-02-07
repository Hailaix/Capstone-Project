import React from "react";
import parse from 'html-react-parser';

const Book = ({ book }) => {
    return (
        <>
            <td>
                <a href={book.link} target='_blank' rel="noreferrer">
                    <img src={book.cover} alt='cover' />
                </a>
            </td>
            <td>
                <h4>{book.title}</h4>
                <h5>authors: {book.authors}</h5>
                <div id="description">
                    {parse(book.description)}
                </div>
            </td>
        </>
    )
}

export default Book;