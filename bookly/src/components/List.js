import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import BooklyAPI from "../api";
import Book from "./Book";

const List = ({ user }) => {
    const { list_id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState();

    //retrieve the reading list from the API
    useEffect(() => {
        const getList = async () => {
            try {
                setList(await BooklyAPI.getList(list_id));
            } catch (e) {
                //if we cannot retrieve the list, go to the list of reading lists
                navigate('/', { replace: true });
            }
        }
        getList();
    }, [list_id, navigate]);

    //removes a book from the list in the db, then removes it from state
    const removeBook = async book_id => {
        await (BooklyAPI.removeBook(list_id, book_id));
        setList({ ...list, books: list.books.filter(book => book.id !== book_id) });
    }
    
    //loading screen if list hasn't been retrieved yet
    if (!list) return (<h1>Loading...</h1>);
    return (
        <div className="container-fluid" id={list.id}>
            <div className="row">
                <div className="col text-start">
                    <h1>{list.title}</h1>
                    <h3>by <Link to={`/users/${list.username}`}>{list.username}</Link></h3>
                    <p>{list.description}</p>
                </div>
                {user === list.username &&
                    <div className="col text-end">
                        <button className="btn btn-secondary">Edit</button>
                        <button className="btn btn-danger">Delete</button>
                    </div>
                }
            </div>
            <div className="row">
                <table className="table table-hover">
                    <tbody>
                        {list.books.map((book, i) => (
                            <tr key={i} id={book.id}>
                                <Book book={book} />
                                {user === list.username &&
                                    <td className="align-bottom">
                                        <button className="btn btn-danger" onClick={() => { removeBook(book.id) }}>X</button>
                                    </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default List;