import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BooklyAPI from "../api";
import Lists from "./Lists";

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState();

    //find the user in the db
    useEffect(() => {
        const getUser = async () => {
            try {
                setProfile(await BooklyAPI.getUser(username));
            } catch (e) {
                //if we can't get the user, go back to the home page
                navigate('/', { replace: true });
            }
        }
        getUser();
    }, [username, navigate]);

    //loading page until profile has been retrieved
    if (!profile) return (<h1>Loading...</h1>);
    return (
        <div className="container">
            <div className="row">
                <div className="col-4">
                    <h1>{profile.username}</h1>
                    <h5>{profile.email}</h5>
                    <p>{profile.bio}</p>
                </div>
                <div className="col">
                    <h2>{profile.username}'s Reading Lists</h2>
                    <Lists lists={profile.lists} />
                </div>

            </div>
        </div>
    )
}

export default Profile;