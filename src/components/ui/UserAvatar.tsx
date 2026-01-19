import React from "react";
import { User } from "../../services/UserService.ts"

import "./UserAvatar.css"

export default function UserAvatar({user}: User | null){
	const getInitials = () => {
		const t = user.first_name[0].toUpperCase();
		const g = user.last_name[0].toUpperCase();
		return t + g
	};
	
	if (user.avatar == null) {
		return (
			<div className="avatar-style-container">{getInitials()}</div>
		)
	}

	return (
		<div>
			
		</div>
	);
}