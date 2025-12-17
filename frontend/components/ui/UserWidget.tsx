import React from "react";
import "./UserWidget.css"
import default_profile_image from "../../assets/default_profile.svg";

interface UserWidgetInterface {
    user: string;
    email: string;
    image?: string;
}

export default function UserWidget({user, email, image}: UserWidgetInterface){
    return (
        <div className="user-profile-container">
            <img className="user-profile-image" src={image ? default_profile_image : undefined}/>

            <div className="user-profile-labels">
                <label style={{fontWeight: "800"}}>{user}</label>
                <label>{email}</label>
            </div>
        </div>
    );
}