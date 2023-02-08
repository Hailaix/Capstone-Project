import React, { useState } from "react";

const CreateListForm = ({ save, cancel }) => {
    const INIT_STATE = {
        title: '',
        description: ''
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
            setErrors(e);
            setFormData(INIT_STATE);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <fieldset className="container">
                <div className="row">
                    <label htmlFor="title">Title:</label>
                    <input
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div className="row">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        className="form-control"
                        rows='3'
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-3">
                    {errors && errors.map((e, i) => (
                        <small key={i} className="text-danger">{e}</small>
                    ))}
                    <button className="btn btn-primary">Save</button>
                    <button className="btn btn-secondary mx-3" onClick={cancel}>Cancel</button>
                </div>
            </fieldset>
        </form>
    )
}

export default CreateListForm;