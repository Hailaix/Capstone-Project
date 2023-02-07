import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BooklyAPI from "../api";
import Lists from "./Lists";
import ProfileEditForm from "./ProfileEditForm";

const Profile = ({ user }) => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState();
    //state for editing the profile
    const [editing, setEditing] = useState(false);
    //state for adding a new list
    const [creating, setCreating] = useState(false);

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

    //simple toggle for editing state
    const toggleEdit = () => {
        setEditing(!editing);
    }
    //simple toggle for creating state
    const toggleCreating = () => {
        setCreating(!creating);
    }

    //submit edit of profile to db and change profile in component
    const submitEdit = async formData => {
        await BooklyAPI.editUser(profile.username, formData);
        setProfile({...profile, email: formData.email, bio: formData.bio});
        toggleEdit();
    }

    //loading page until profile has been retrieved
    if (!profile) return (<h1>Loading...</h1>);
    return (
        <div className="container">
            <div className="row">
                <div className="col-4">
                    <h1>{profile.username}</h1>
                    {editing
                        ? <ProfileEditForm email={profile.email} bio={profile.bio} save={submitEdit} cancel={toggleEdit} />
                        : <>
                            <h5>{profile.email}</h5>
                            <p>{profile.bio}</p>
                            {user === profile.username &&
                                <div>
                                    <button className="btn btn-secondary" onClick={toggleEdit}>Edit Profile</button>
                                    <button className="btn btn-danger">Delete Profile</button>
                                </div>
                            }
                        </>}
                </div>
                <div className="col">
                    <h2>{profile.username}'s Reading Lists</h2>
                    <Lists lists={profile.lists} />
                    {user === profile.username &&
                        <button className="btn btn-success" onClick={toggleCreating}>Create a New Reading List</button>
                    }
                </div>

            </div>
        </div>
    )
}

export default Profile;