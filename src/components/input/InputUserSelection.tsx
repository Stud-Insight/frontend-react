import React, { ReactNode, useState, useEffect } from "react";
import { User } from "../../services/UserService";
import Field from "../../atoms/input/Field";
import UserWidget from "../objects/UserWidget";
import Tag from "../../atoms/ui/Tag";

import "./InputUserSelection.css";

interface InputUserSelectionProps {
	label: string;
	icon?: ReactNode;
	value: Set<User>;
	users: User[];
	maxSelection?: number;
	onChange?: (users: Set<User>) => void;
};

export default function InputUserSelection({label, icon, value, users, onChange, maxSelection = 10}: InputUserSelectionProps){
	const selected = value;

	const selectUserHandle = (user: User) => {
		const newSet = new Set(selected);

		if (Array.from(newSet).some(u => u.id === user.id)) {
			newSet.forEach(u => {
				if (u.id === user.id) newSet.delete(u);
			});
		} else {
			if (newSet.size < maxSelection) {
				newSet.add(user);
			}
		}

		onChange?.(newSet);
	};
	
	return (	
		<div>
			<Field label={label} icon={icon}>
				<div className="user-selection-content">
					{Array.from(users).map(user => (
						<UserWidget user={user} selected={value.has(user)} onClick={() => selectUserHandle(user)}/>
					))}
				</div>
			</Field>
		</div>
	)
}