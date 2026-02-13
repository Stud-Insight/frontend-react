import React from "react";
import UserAvatar from "../ui/UserAvatar";
import { User } from "../../services/UserService";
import { MdDone } from "react-icons/md";

import "./UserWidget.css"

interface UserWidgetProps {
	user: User;
	onClick?: () => void;
	selected?: boolean;
	onDelete?: (user: User) => void;
};

export default function UserWidget({user, onClick, selected = true, onDelete}: UserWidgetProps){
	return (
		<div className={`user-widget-layout ${selected ? "selected" : undefined}`} onClick={onClick}>
			<div className="user-widget-left">
				<UserAvatar user={user}/>
			</div>

			<div className="user-widget-right">
				<span style={{fontWeight: "var(--big-bold)"}}>{user.first_name} {user.last_name}</span>
				{/* <span>{role ? role : undefined}</span> */}
				<span>{user.id.slice(0, 8)}</span>
				<span>{user.email}</span>
			</div>

			<div className={`user-selected-icon ${selected ? "selected" : undefined}`}>
				<MdDone/>
			</div>
		</div>
	)
}