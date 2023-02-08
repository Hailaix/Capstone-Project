import React from "react";

const Review = ({ review }) => {
    return (
        <td>
            <h5>
                <b>{review.rating}/10 </b>
                <b>{review.title}</b>
            </h5>
            <small><i>by {review.username}</i></small>
            <p>{review.body}</p>
        </td>
    )
}

export default Review;