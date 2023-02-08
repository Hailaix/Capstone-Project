import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BooklyAPI from "../api";
import CreateListForm from "./CreateListForm";
import Lists from "./Lists";
import ProfileEditForm from "./ProfileEditForm";

const Profile = ({ user, logout }) => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState();
    //state for editing the profile
    const [editing, setEditing] = useState(false);
    //state for adding a new list
    const [creating, setCreating] = useState(false);
    //state for deletion confirmation
    const [delConfirm, setDelConfirm] = useState(false);

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
        setProfile({ ...profile, email: formData.email, bio: formData.bio });
        toggleEdit();
    }

    //submit the creation of a new reading list and update profile
    const submitCreate = async formData => {
        const list = await BooklyAPI.createList(formData);
        setProfile({ ...profile, lists: [...profile.lists, list] });
        toggleCreating();
    }

    //simple toggle to switch between delete confirmation buttons
    const toggleDel = () => {
        setDelConfirm(!delConfirm);
    }
    //deletes the user profile, logs out and returns to the homepage
    const deleteProfile = async () => {
        await BooklyAPI.removeUser(profile.username);
        logout();
        navigate('/');
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
                                <div className="row">
                                    {delConfirm
                                        ? <div className="col">
                                            <p className="text-danger">Are you sure?</p>
                                            <button className="btn btn-sm btn-danger" onClick={deleteProfile}>Yes</button>
                                            <button className="btn btn-sm btn-secondary" onClick={toggleDel}>No</button>
                                        </div>
                                        : <div className="col">
                                            <button className="btn btn-secondary" onClick={toggleEdit}>Edit Profile</button>
                                            <button className="btn btn-danger" onClick={toggleDel}>Delete Profile</button>
                                        </div>
                                    }

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
                    {creating && <CreateListForm save={submitCreate} cancel={toggleCreating} />}
                </div>

            </div>
        </div >
    )
}

export default Profile;