import React, { useState, useEffect } from "react";
import ModalDialog from "./ModalDialog";
import UserService,{ User } from "../../services/UserService"
import UserWidget from "../objects/UserWidget";

import "./UserSelectionDialog.css"
import SubmitButton from "./SubmitButton";
import { FaPlus } from "react-icons/fa6";

interface UserSelectionDialogProps {
	label: string;
	role_filter?: string[];
	onClose?: () => void;
	onConfirm?: (users: Set<string>) => void;
};

export default function UserSelectionDialog({label, role_filter, onClose, onConfirm}: UserSelectionDialogProps) {
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

	const userSelectionHandle = (id: string) => {
		setSelectedUsers(prev => {
			const newSet = new Set(prev);

			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}

			return newSet;
		});
	};

	const confirmHandle = () => {
		onConfirm ? onConfirm(selectedUsers) : undefined;
	}

	const selectionString = () => {
		if (selectedUsers.size > 0){
			return `(${selectedUsers.size})`
		}
		return ""
	}	

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const list = await UserService.getAllUsers();

				const filtered = role_filter
					? list.filter(user =>
						user.groups.some(group => role_filter.includes(group.name))
					)
					: list;

				setUsers(filtered);
			} catch {
				setUsers([]);
			}
		};

		fetchUsers();
	}, [role_filter]);

	return (
		<ModalDialog label={label} onClose={onClose} width={500}>
			<div className="user-list-layout">
				{users.map(user => (
					<UserWidget key={user.id} user={user} selected={selectedUsers.has(user.id)}onClick={() => userSelectionHandle(user.id)}/>
				))}
			</div>

			<div className="user-list-buttons">
				<SubmitButton label="Annuler" style="cancel" width={`${100}%`} onChange={onClose}/>
				<SubmitButton icon={<FaPlus/>} label={`Ajouter ${selectionString()}`} width={`${100}%`} onChange={confirmHandle}/>
			</div>
		</ModalDialog>
	);
}
