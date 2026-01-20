import React from "react";
import "./UserWidget.css"
import { User } from "../../services/UserService.ts"
import UserAvatar from "../ui/UserAvatar";
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
			<div className="user-avatar-container">
				<UserAvatar user={user}/>
			</div>
            
            <div className="user-profile-labels-layout">
                <div className="user-profile-top-labels">
                    <label className="user-profile-labels" style={{fontWeight: "800"}}>{user?.first_name} {user?.last_name}</label>
                    {<PermissionTag perm={perm}/>}
                </div>
                <label className="user-profile-labels">{user?.email}</label>
            </div>
        </div>
    );
}