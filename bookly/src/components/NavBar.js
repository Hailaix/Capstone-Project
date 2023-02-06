import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = ({ user, logout }) => {
    return (
        <nav>
            <NavLink to='/'>
                Home
            </NavLink>
            <div>
                {user
                    ? <button onClick={logout}>Log Out</button>
                    : <NavLink to='/login'> Login </NavLink>
                }
            </div>
        </nav>
    );
}

export default NavBar;