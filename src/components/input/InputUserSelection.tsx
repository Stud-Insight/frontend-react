import React, { ReactNode, useState, useEffect } from "react";
import { User } from "../../services/UserService";
import Field from "../../atoms/input/Field";
import UserWidget from "../objects/UserWidget";
import Tag from "../../atoms/ui/Tag";

import "./InputUserSelection.css";

interface InputUserSelectionProps {
	label: string;
	icon?: ReactNode;
	users: User[];
	maxSelection?: number;
	onChange?: (users: Set<User>) => void;
};

export default function InputUserSelection({label, icon, users, onChange, maxSelection = users.length}: InputUserSelectionProps){
	const [filter, setFilter] = useState<User[]>([]);
	const [value, setValue] = useState<string>("");
	const [selected, setSelected] = useState<Set<User>>(new Set());

	const changeHandle = (e: string) => {
		setValue(e);
	}	

	const selectUserHandle = (user: User) => {
		setSelected(prev => {
			const newSet = new Set(prev);

			if (newSet.has(user)) {
				newSet.delete(user);
			} else {
				if (selected.size < maxSelection){
					newSet.add(user);
				}
			}

			return newSet;
		});

		onChange?.(selected);
		setValue("");
	};
	
	useEffect(() => {
		const lower = value.toLowerCase();

		const g = users.filter(user => {
			const name = `${user.first_name} ${user.last_name}`.toLowerCase();

			const isSelected = Array.from(selected).some(
				u => u.id === user.id
			);

			return !isSelected &&
				(name.includes(lower) || user.email.includes(lower));
		});

		setFilter(g);
	}, [value, selected, users]);

	return (	
		<>
			<Field className="user-selection-input" label={label} icon={icon}>
				{selected && 
					Array.from(selected).map(user => (
						<Tag key={user.id} label={`${user.first_name} ${user.last_name}`} className="user-selection-tag-style" onDelete={() => selectUserHandle(user)}/>
					))
				}
				<input value={value} onChange={(e) => changeHandle(e.target.value)}/>
			</Field>
			
			{filter.length > 0 && 
				<div className="user-selection-content">
					{filter.map(user => (
						<UserWidget user={user} selected={false} onClick={() => selectUserHandle(user)}/>
					))}
				</div>
			}
		
		</>
	)
}