import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import BooklyAPI from "../api";
import Book from "./Book";
import ListEditForm from "./ListEditForm";
import ReviewForm from "./ReviewForm";

const List = ({ user }) => {
    const { list_id } = useParams();
    const navigate = useNavigate();
    //the list
    const [list, setList] = useState();
    //toggle edit mode
    const [editing, setEditing] = useState(false);
    //provides a confirmation before deletion
    const [delConfirm, setDelConfirm] = useState(false);
    //toggle review form
    const [reviewing, setReviewing] = useState(false);

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
    //deletes the list and returns to the profile page
    const deleteList = async () => {
        await BooklyAPI.removeList(list_id);
        //after deletion return to our profile page
        navigate(`/users/${list.username}`);
    }

    //toggle on the review edit/create form
    const toggleReview = () => {
        setReviewing(!reviewing);
    }

    //removes a book from the list in the db, then removes it from state
    const removeBook = async book_id => {
        await (BooklyAPI.removeBook(list_id, book_id));
        setList({ ...list, books: list.books.filter(book => book.id !== book_id) });
    }

    //loading screen if list hasn't been retrieved yet
    if (!list) return (<h1>Loading...</h1>);

    //if the logged in user has left a review, find it
    const userReview = list.reviews.filter(review => (review.username === user))[0];

    //depending on if we are editing or creating, submit the data to the db
    const submitReview = async formData => {
        if (!userReview) {
            //if a review is being created, create it
            const review = await BooklyAPI.createReview(list_id, formData);
            //add the new review to the list
            setList({ ...list, reviews: [...list.reviews, review] });
            toggleReview();
        } else {
            //if a review is being edited, edit it in the db
            const review = await BooklyAPI.editReview(list_id, user, formData);
            //replace the old review in the list with the new one
            setList({
                ...list, reviews: list.reviews.map(r => (
                    r.username === review.username
                        ? review
                        : r
                ))
            });
            toggleReview();
        }
    }

    return (
        <div className="container-fluid align-items-center" id={list.id}>
            <div className="row">
                <div className="col-3 col-m-2">
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
                    </div>
                    <div className="row">
                        {user === list.username &&
                            <div className="col text-end">

                                {delConfirm
                                    ? <div>
                                        <p className="text-danger">Are you sure?</p>
                                        <button className="btn btn-sm btn-danger" onClick={deleteList}>Yes</button>
                                        <button className="btn btn-sm btn-secondary" onClick={toggleDel}>No</button>
                                    </div>
                                    : <div>
                                        <button className="btn btn-secondary" onClick={toggleEdit}>Edit list</button>
                                        <button className="btn btn-danger" onClick={toggleDel}>Delete list</button>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                    <div className="row">
                        <h3>Reviews</h3>
                        {user !== list.username &&
                            <div className="col">
                                {reviewing
                                    ? <ReviewForm review={userReview} save={submitReview} cancel={toggleReview} />
                                    : <button className="btn btn-link" onClick={toggleReview}>
                                        {userReview
                                            ? "Edit your Review"
                                            : "Leave a Review"
                                        }
                                    </button>
                                }
                            </div>
                        }
                        {list.reviews.length === 0
                            ? <p><i>No Reviews yet...</i></p>
                            : <p>Review</p>
                        }
                    </div>
                </div>
                <div className="col">
                    <div className="row">
                        <table className="table table-hover">
                            <tbody>
                                {list.books.map((book, i) => (
                                    <tr key={i} id={book.id}>
                                        <Book book={book} />
                                        {user === list.username &&
                                            <td className="align-bottom">
                                                <button className="btn btn-danger" onClick={() => { removeBook(book.id) }}>Remove</button>
                                            </td>
                                        }
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default List;