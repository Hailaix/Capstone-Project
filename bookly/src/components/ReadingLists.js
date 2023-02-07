import React, { useEffect, useState } from "react";
import BooklyAPI from "../api";
import Lists from "./Lists";

const ReadingLists = () => {
    const [lists, setLists] = useState();
    const getLists = async () => {
        setLists(await BooklyAPI.getLists());
    }
    //on mount get list of all reading lists
    useEffect(() => {
        getLists();
    }, []);
    if (!lists) return (<h1>Loading...</h1>);
    return (
        <div className="container">
            <h1>Newest Reading Lists</h1>
            <Lists lists={lists} />
        </div>
    )
}

export default ReadingLists;