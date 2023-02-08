import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpForm = ({ submit }) => {
    const INIT_STATE = {
        username: '',
        password: '',
        email: ''
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

    //sends data to sign up function
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await submit(formData);
            navigate('/');
        } catch (e) {
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
                <label>Email</label>
                <input
                    name="email"
                    type='email'
                    value={formData.email}
                    autoComplete='email'
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

export default SignUpForm;