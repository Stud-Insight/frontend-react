import React from "react";
import "./UserWidget.css"
import default_profile_image from "../../assets/default_profile.svg";
import PermissionTag from "./PermissionTag.tsx";

interface UserWidgetInterface {
    user: string;
    email: string;
    image?: string;
    perm?: "etu" | "prof" | "admin" | "extern";
}

export default function UserWidget({user, email, image, perm}: UserWidgetInterface){
    return (
        <div className="user-profile-container">
            <img className="user-profile-image" src={image ? default_profile_image : default_profile_image}/>

            <div className="user-profile-labals-layout">
                <div className="user-profile-top-labels">
                    <label className="user-profile-labels" style={{fontWeight: "800"}}>{user}</label>
                    {perm ? <PermissionTag perm={perm}/> : undefined}
                </div>
                <label className="user-profile-labels">{email}</label>
            </div>
        </div>
    );
}