import React from "react";
import { User } from "../../services/UserService.ts"
import "./UserAvatar.css";

interface UserAvatarProps {
	user: User;
	size: number;
};

export default function UserAvatar({user, size}: UserAvatarProps){
	const getInitials = () => {
		const t = user.first_name[0].toUpperCase();
		const g = user.last_name[0].toUpperCase();
		return t + g
	};
	
	if (user.avatar == null) {
		return (
			<div className="avatar-style-container" style={{width: `${size}px`, height: `${size}px`}}>
				{getInitials()}
			</div>
		)
	}

	return (
		<div>
			{/* TODO: a montrer le vrai avatar */}
		</div>
	);
}