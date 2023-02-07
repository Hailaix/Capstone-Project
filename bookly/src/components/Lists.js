import React from "react";
import { Link } from "react-router-dom";

const Lists = ({ lists }) => {
    return (
        <table className="table table-hover">
            <tbody>
                {lists.map(list => (
                    <tr key={list.id}>
                        <td><Link to={`/lists/${list.id}`}>{list.title}</Link></td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Lists;