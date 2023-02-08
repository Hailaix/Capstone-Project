import React, { useState } from "react";
import BooklyAPI from "../api";
import SearchForm from "./SearchForm";
import Book from "./Book";

const SearchPage = () => {
    const [books, setBooks] = useState();

    const submitSearch = async formData => {
        setBooks(await BooklyAPI.search(formData));
    }

    return (
        <div className="Container-fluid">
            <div className="row bg-light">
                <SearchForm submit={submitSearch} />
            </div>
            {books && <div className="row">
                <table className="table table-hover">
                    <tbody>
                        {books.map((book, i) => (
                            <tr key={i} id={book.id}>
                                <Book book={book} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}
        </div>
    )
}

export default SearchPage;