import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import BooklyAPI from './api';
import useLocalStorage from './useLocalStorage';

import NavBar from './components/NavBar';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';

import List from './components/List';
import ReadingLists from './components/ReadingLists';
import Profile from './components/Profile';

import './App.css';



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
        setUser(username);
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
        <Route path='signup' element={<SignUpForm submit={signup} />} />
        <Route path='users/:username' element={user ? <Profile /> : <Navigate to='/login' />} />
        <Route path='lists' element={user ? <ReadingLists /> : <Navigate to='/login' />} />
        <Route path='lists/:list_id' element={user ? <List /> : <Navigate to='/login' />} />
        <Route path='search' element={user ? <div>search form</div> : <Navigate to='login' />} />
      </Routes>
    </div>
  );
}

export default App;
