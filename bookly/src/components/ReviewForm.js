import React, { useState } from "react";

const ReviewForm = ({ review = {}, save, cancel }) => {
    //if editing, fills from review, blanks otherwise
    const INIT_STATE = {
        rating: review.rating || 0,
        title: review.title || '',
        body: review.body || ''
    }
    const [formData, setFormData] = useState(INIT_STATE);
    const [errors, setErrors] = useState([]);

    //generic change handler
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
    };

    //saves new data to profile
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await save(formData);
        } catch (e) {
            if(!Array.isArray(e)) console.log(e);
            setErrors(e);
            setFormData(INIT_STATE);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <fieldset className="container">
                <div className="row m-2">
                    <div className="col">
                        <input
                            className="form-control"
                            type="number"
                            name="rating"
                            min={0}
                            max={10}
                            value={formData.rating}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="row m-2">
                    <div className="col">
                        <input
                            className="form-control"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="title your review..."
                        />
                    </div>
                </div>
                <div className="row m-2">
                    <div className="col">
                        <input
                            className="form-control"
                            name="body"
                            value={formData.body}
                            onChange={handleChange}
                            placeholder="Share your thoughts..."
                        />
                    </div>
                </div>
                <div className="row mb-2 mx-2">
                    <div className="col text-end">
                        <button className="btn btn-success">Submit</button>
                        <button className="btn btn-secondary" onClick={cancel}>Cancel</button>
                    </div>
                </div>
                <div>
                    {errors.map((e, i) => (
                        <small key={i} className="text-danger">{e}</small>
                    ))}
                </div>
            </fieldset>
        </form>
    )
}

export default ReviewForm;