import React from "react";
import "./UserWidget.css"
import { User } from "../../services/UserService.ts"
import default_profile_image from "../../assets/default_profile.svg";
import PermissionTag from "./PermissionTag.tsx";

interface UserWidgetInterface {
    user: User | null;
    image?: string;
}

export default function UserWidget({user, image}: UserWidgetInterface){
    let perm: "etu" | "extern" | "prof" | "admin" = "etu";

    if (user?.is_superuser) {
        perm = "admin";
    } else {
        if (user?.is_staff) {
            perm = "prof";
        } else {
            perm = "etu";
        }
    }

    return (
        <div className="user-profile-container">
            <img className="user-profile-image" src={image ? default_profile_image : default_profile_image}/>
            <div className="user-profile-labals-layout">
                <div className="user-profile-top-labels">
                    <label className="user-profile-labels" style={{fontWeight: "800"}}>{user?.first_name} {user?.last_name}</label>
                    {<PermissionTag perm={perm}/>}
                </div>
                <label className="user-profile-labels">{user?.email}</label>
            </div>
        </div>
    );
}