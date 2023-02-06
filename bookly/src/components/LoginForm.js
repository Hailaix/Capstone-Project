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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input
                    name="username"
                    value={formData.username}
                    autoComplete='username'
                    onChange={handleChange}
                />
                <label>Password</label>
                <input
                    name="password"
                    type='password'
                    value={formData.password}
                    autoComplete='current-password'
                    onChange={handleChange}
                />
                <input type='submit' />
                {errors.map((e, i) => (
                    <small key={i}>{e}</small>
                ))}
            </form>
        </div>
    )
}

export default LoginForm;