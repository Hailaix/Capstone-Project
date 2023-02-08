import React, { useState } from "react";

const SearchForm = ({ submit }) => {
    const INIT_STATE = {
        q: '',
        intitle: '',
        inauthor: '',
    }
    const [formData, setFormData] = useState(INIT_STATE);
    const [errors, setErrors] = useState([]);

    //hold the page in state for pagination
    const [page, setPage] = useState(0);
    //determines if the next Page button is displayed, toggles on first search
    const [searching, setSearching] = useState(false);
    //disables buttons to prevent searching while waiting for a response
    const [disabled, setDisabled] = useState(false);

    //generic change handler
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
    };

    const search = async offset => {
        try {
            setDisabled(true);
            await submit({ ...formData, offset });
            if (!searching) setSearching(true);
            setDisabled(false);
        } catch (e) {
            setErrors(e);
            setFormData(INIT_STATE);
            setDisabled(false);
        }
    }
    //submits search
    const handleSubmit = e => {
        e.preventDefault();
        search(0);
        //reset page to 0 so we no longer see prev button
        setPage(0);
    };

    //update the offset and search
    const flipPage = delta => {
        //search for the next offset
        search(((page + delta) * 10));
        setPage(page + delta);
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset className="container">
                <div className="row">
                    <div className="col-auto">
                        <label htmlFor="q" className="col-form-label">Search:</label>
                    </div>
                    <div className="col">
                        <input
                            className="form-control"
                            name="q"
                            value={formData.q}
                            placeholder='Search...'
                            onChange={handleChange}
                        />
                    </div>

                </div>
                <div className="row g-3 justify-content-center">
                    <label htmlFor="intitle" className="visually-hidden">Title:</label>
                    <div className="col-4">
                        <input
                            className="form-control"
                            name="intitle"
                            value={formData.intitle}
                            placeholder='Search by Title...'
                            onChange={handleChange}
                        />
                    </div>
                    <label htmlFor="inauthor" className="visually-hidden">Author:</label>
                    <div className="col-4">
                        <input
                            className="form-control"
                            name="inauthor"
                            value={formData.inauthor}
                            placeholder='Search by Author...'
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="mt-3">
                    {errors && errors.map((e, i) => (
                        <small key={i} className="text-danger">{e}</small>
                    ))}
                    {page > 0 &&
                        <button
                            className="btn btn-secondary"
                            onClick={() => flipPage(-1)}
                            disabled={disabled}
                        >
                            Prev Page
                        </button>}
                    <button className="btn btn-primary" disabled={disabled}>Search</button>
                    {searching &&
                        <button
                            className="btn btn-secondary"
                            onClick={() => flipPage(1)}
                            disabled={disabled}
                        >
                            Next Page
                        </button>}
                </div>
            </fieldset>
        </form>
    )
}

export default SearchForm;