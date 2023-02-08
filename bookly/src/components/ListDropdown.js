import React, { useState } from "react";
import BooklyAPI from "../api";

const ListDropdown = ({ book_id, lists }) => {
    const [messages, setMessages] = useState([]);

    const handleClick = async list_id => {
        try {
            await BooklyAPI.addBook(list_id, book_id);
            setMessages(['added!']);
        } catch (e) {
            setMessages(e);
        }
    }

    return (
        <div className="dropdown">
            <button
                className="btn btn-secondary dropdown-toggle"
                data-bs-toggle='dropdown'
            >
                Add to List
            </button>
            <ul className="dropdown-menu">
                {lists.map(list => (
                    <li key={list.id}>
                        <button className="dropdown-item" href="#" onClick={() => handleClick(list.id)}>{list.title}</button>
                    </li>
                ))}
            </ul>
            {messages.length !== 0 &&
                <div>
                    {messages.map((m, i) => (
                        <small key={i}>{m}</small>
                    ))}
                </div>
            }
        </div>
    )
}

export default ListDropdown;