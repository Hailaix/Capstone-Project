import React, { useState } from "react";

const ProfileEditForm = ({ email, bio, save, cancel }) => {
    const INIT_STATE = {
        email,
        bio,
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
                    <label htmlFor="email">Email:</label>
                    <input
                        className="form-control"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="row">
                    <label htmlFor="bio">Bio:</label>
                    <textarea
                        className="form-control"
                        rows='3'
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-3">
                    {errors && errors.map((e, i) => (
                        <small key={i} className="text-danger">{e}</small>
                    ))}
                    <button className="btn btn-primary">Save</button>
                    <button className="btn btn-secondary mx-3">Cancel</button>
                </div>
            </fieldset>
        </form>
    )
}

export default ProfileEditForm;