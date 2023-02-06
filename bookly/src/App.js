import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import BooklyAPI from './api';
import useLocalStorage from './useLocalStorage';

import LoginForm from './components/LoginForm';

import './App.css';
import NavBar from './components/NavBar';

function App() {

  //the currently logged in username
  const [user, setUser] = useState(null);

  //set up jwt in localStorage under key 'token'
  const [token, setToken] = useLocalStorage('token');

  //give the token to the API
  BooklyAPI.token = token;

  //whenever token is changed, grab the username from the token
  useEffect(() => {
    const getUser = () => {
      //if there is no token, do nothing
      if (token) {
        //if there is a token, extract the username from it and set it in state
        const { username } = jwt_decode(token);
        //if somehow the token in storage does not have a username, set token to null as it is not our token
        if (!username) {
          setToken(null);
        } else {
          setUser(username);
        }
      }
    }
    getUser();
  }, [token]);

  //logs in a new user
  const login = async formData => {
    const newToken = await BooklyAPI.login(formData);
    setToken(newToken);
  }

  //log out current user by removing the token and username from state
  const logout = () => {
    setToken(null);
    setUser(null);
  }

  //sign up creates a new user and logs them in
  const signup = async formData => {
    const newToken = await BooklyAPI.register(formData);
    setToken(newToken);
  }

  /** some routes will navigate to the login page unless there is a user logged in */
  return (
    <div className="App">
      <NavBar user={user} logout={logout} />
      <Routes>
        <Route path='/' element={<div>home</div>} />
        <Route path='login' element={<LoginForm submit={login} />} />
      </Routes>
    </div>
  );
}

export default App;
