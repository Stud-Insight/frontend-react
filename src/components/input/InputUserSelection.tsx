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

export default function InputUserSelection({label, icon, value, users, onChange, maxSelection = users.length}: InputUserSelectionProps){
	const [filter, setFilter] = useState<User[]>([]);
	const [searchValue, setSearchValue] = useState<string>("");
	const selected = value;
	
	const changeHandle = (e: string) => {
		setSearchValue(e);
	}	

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
		setSearchValue("");
	};
	
	useEffect(() => {
		const lower = searchValue.toLowerCase();

		const filtered = users.filter(user => {
			const name = `${user.first_name} ${user.last_name}`.toLowerCase();

			const isSelected = Array.from(selected).some(
				u => u.id === user.id
			);

			return !isSelected && (name.includes(lower) || user.email.toLowerCase().includes(lower));
		});

		setFilter(filtered);
	}, [searchValue, selected, users]);

	return (	
		<div>
			<Field label={label} icon={icon}>
				<div className="user-selection-content">
					{Array.from(value).map(user => (
						<UserWidget user={user} selected={true} onClick={() => selectUserHandle(user)}/>
					))}

					{filter.map(user => (
						<UserWidget user={user} selected={false} onClick={() => selectUserHandle(user)}/>
					))}
				</div>
			</Field>
		</div>
	)
}