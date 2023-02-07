import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import BooklyAPI from "../api";
import Book from "./Book";

const List = () => {
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

    //loading screen if list hasn't been retrieved yet
    if (!list) return (<h1>Loading...</h1>);
    return (
        <div id={list.id}>
            <h1>{list.title}</h1>
            <h3>by {list.username}</h3>
            <p>{list.description}</p>
            <br/>
            <div>
                {list.books.map((book, i) => (
                    <Book key={i} book={book} />
                ))}
            </div>
        </div>
    )
}

export default List;