import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ submit }) => {
    //initial state for form reset
    const INIT_STATE = {
        username: '',
        password: ''
    };
    const [formData, setFormData] = useState(INIT_STATE);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    //generic change handler
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
    };

    //sends data to login function
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await submit(formData);
            navigate('/');
        } catch (e) {
            //error would be failed log in
            setErrors(e);
            setFormData(INIT_STATE);
        }
    };

    //changes page to signup
    const toSignUp = () => {
        navigate('/signup');
    }

    return (
        <div className="container-fluid">
            <div className="row justify-content-center mt-3">
                <div className="col-6 bg-light">
                    <div className="row">
                        <h1>Login</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="row m-2">
                            <div className="col-4">
                                <label htmlFor="username" className="col-form-label">Username:</label>
                            </div>
                            <div className="col-8">
                                <input
                                    className="form-control"
                                    name="username"
                                    value={formData.username}
                                    autoComplete='username'
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row mb-2 mx-2">
                            <div className="col-4">
                                <label htmlFor="password" className="col-form-label">Password:</label>
                            </div>
                            <div className="col-8">
                                <input
                                    className="form-control"
                                    name="password"
                                    type='password'
                                    value={formData.password}
                                    autoComplete='current-password'
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row mb-2 mx-2">
                            <div className="col text-end">
                                <button className="btn btn-success">Login</button>
                            </div>
                        </div>
                        <div>
                            {errors.map((e, i) => (
                                <small key={i} className="text-danger">{e}</small>
                            ))}
                        </div>
                    </form>
                    <div className="row mb-2">
                        <p>Not a member?<button className="btn btn-link" onClick={toSignUp}>Sign up here.</button></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginForm;