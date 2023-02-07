import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = ({ user, logout }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">Bookly</NavLink>
                {user && <NavLink className="nav-link" to={`/users/${user}`}>Profile</NavLink>}
                <NavLink className="nav-link" to="/lists">Reading Lists</NavLink>
                <NavLink className="nav-link" to="/search">Book Search</NavLink>
                <div className="nav-item mr-auto">
                    {user
                        ? <button className="btn btn-link nav-link" onClick={logout}>Log Out</button>
                        : <NavLink className="nav-link" to='/login'> Login </NavLink>
                    }
                </div>
            </div>
        </nav>
    );
}

export default NavBar;