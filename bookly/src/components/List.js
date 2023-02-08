import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import BooklyAPI from "../api";
import Book from "./Book";
import ListEditForm from "./ListEditForm";

const List = ({ user }) => {
    const { list_id } = useParams();
    const navigate = useNavigate();
    //the list
    const [list, setList] = useState();
    //toggle edit mode
    const [editing, setEditing] = useState(false);
    //provides a confirmation before deletion
    const [delConfirm, setDelConfirm] = useState(false);

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

    //simple toggle for edit mode
    const toggleEdit = () => {
        setEditing(!editing);
    }
    //submits the edit and updates the state of the current page
    const submitEdit = async formData => {
        await BooklyAPI.editList(list_id, formData);
        setList({ ...list, title: formData.title, description: formData.description });
        toggleEdit();
    }

    //simple toggle for delete confirmation
    const toggleDel = () => {
        setDelConfirm(!delConfirm);
    }
    const deleteList = async () => {
        await BooklyAPI.removeList(list_id);
        //after deletion return to our profile page
        navigate(`/users/${list.username}`);
    }

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
                {editing
                    ? <div className="col">
                        <ListEditForm title={list.title} description={list.description} save={submitEdit} cancel={toggleEdit} />
                    </div>
                    : <div className="col text-start">
                        <h1>{list.title}</h1>
                        <h3>by <Link to={`/users/${list.username}`}>{list.username}</Link></h3>
                        <p>{list.description}</p>
                    </div>
                }
                {user === list.username &&
                    <div className="col text-end">

                        {delConfirm
                            ? <div>
                                <p className="text-danger">Are you sure?</p>
                                <button className="btn btn-sm btn-danger" onClick={deleteList}>Yes</button>
                                <button className="btn btn-sm btn-secondary" onClick={toggleDel}>No</button>
                            </div>
                            : <div>
                                <button className="btn btn-secondary" onClick={toggleEdit}>Edit</button>
                                <button className="btn btn-danger" onClick={toggleDel}>Delete</button>
                            </div>
                        }
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