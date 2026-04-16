import React from "react";
import { User, UserRolesColors, UserRoles } from "../../services/UserService.ts"
import "./UserAvatar.css";

interface UserAvatarProps {
	user: User | null;
	size?: number;
};

export default function UserAvatar({user, size}: UserAvatarProps){
	const getInitials = () => {
		if (user == null) {
			return "";
		}
		
		const t = user?.first_name[0].toUpperCase();
		const g = user?.last_name[0].toUpperCase();
		return t + g;
	};

	const getColor = (user: User | null) => {
		return "var(--blue-col)";

		if (user?.groups){
			let roles = user?.groups.map(role => {
				return role.name;
			});

			const prioList: UserRoles[] = [
				UserRoles.ADMIN,
				UserRoles.RESPO_STAGE,
				UserRoles.RESPO_TER,
				UserRoles.ENCADRANT,
				UserRoles.EXTERNE,
				UserRoles.ETUDIANT
			];

			for (let role of prioList){
				if (roles?.includes(role)){
					return UserRolesColors.get(role);
				}	
			}
		} else {
			return "var(--gray2-col)";
		}
	};
	
	if (user?.avatar) {
		const src = user.avatar.startsWith("http") ? user.avatar : `${process.env.API_URL?.replace(/\/api\/?$/, "") ?? ""}${user.avatar}`;
		return (
			<div className="avatar-style-container" style={{width: `${size}px`, height: `${size}px`, padding: 0, overflow: "hidden"}}>
				<img src={src} alt="avatar" style={{width: "100%", height: "100%", objectFit: "cover"}}/>
			</div>
		);
	}

	return (
		<div className="avatar-style-container" style={{width: `${size}px`, height: `${size}px`, backgroundColor: `${getColor(user)}`}}>
			{getInitials()}
		</div>
	)
}