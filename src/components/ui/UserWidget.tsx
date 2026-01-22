import React from "react";
import UserAvatar from "./UserAvatar";

import { User } from "../../services/UserService";

import "./UserWidget.css"

interface UserWidgetProps {
	user: User;
	role?: string
}

export default function UserWidget({ user, role }: UserWidgetProps){
	return (
		<div className="user-widget-layout">
			<div className="user-widget-right">
				<UserAvatar user={user}/>
			</div>

			<div className="user-widget-left">
				<label style={{fontWeight: 400}}>{user.first_name} {user.last_name}</label>
				<label>{role ? role : undefined}</label>
				<label>{user.email}</label>
			</div>
		</div>
	)
}