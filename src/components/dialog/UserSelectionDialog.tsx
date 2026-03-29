import React, { useState, useEffect } from "react";
import ModalDialog from "./ModalDialog";
import UserService,{ User } from "../../services/UserService"
import UserWidget from "../objects/UserWidget";
import InputField from "../input/InputField";
import "./UserSelectionDialog.css"
import Button from "../../atoms/input/Button";
import { FaPlus } from "react-icons/fa6";

interface UserSelectionDialogProps {
	label: string;
	value?: User[];
	role_filter?: string[];
	exclude?: string[];
	button_text?: string;
	onClose?: () => void;
	onConfirm?: (users: Set<User>) => void;
};

export default function UserSelectionDialog({label, value, role_filter, button_text = "Ajouter", exclude, onClose, onConfirm}: UserSelectionDialogProps) {
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<Set<User>>(new Set());
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	
	const onSearchHandle = (text: string) => {
		let filtered = users.filter(user => {
			let name = user.last_name + " " + user.first_name
			return selectedUsers.has(user) || (name.toLowerCase().includes(text.toLowerCase()) || user.email.toLowerCase().includes(text.toLowerCase())) ;
		});

		setFilteredUsers(filtered);
	}

	const userSelectionHandle = (user: User) => {
		setSelectedUsers(prev => {
			const newSet = new Set(prev);

			const existing = [...newSet].find(u => u.id === user.id);

			if (existing) {
				newSet.delete(existing);
			} else {
				newSet.add(user);
			}

			return newSet;
		});
	};

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

				let filtered = role_filter
					? list.filter(user =>
						user.groups.some(group => role_filter.includes(group.name))
					)
					: list;

				setUsers(filtered);
			} catch {
				setUsers([]);
			}
		};

		if (value){
			setUsers(value);
		} else {
			fetchUsers();
		}

	}, [role_filter]);

	useEffect(() => (
		onSearchHandle("")
	), [users]);
	return (
		<ModalDialog label={label} onClose={onClose} className="user-list-dialog-content">
			<div className="user-select-search">
				<InputField onChange={onSearchHandle} placeholder="Rechercher un utilisateur..."/>
			</div>
			<div className="user-list-layout">
				{filteredUsers.map(user => (
					<UserWidget key={user.id} showId={false} showRoles={true} user={user} selected={Array.from(selectedUsers).some(g => user.id == g.id)} onClick={() => userSelectionHandle(user)}/>
				))}
			</div>

			<div className="user-list-buttons">
				<Button label="Annuler" style="cancel" width="100%" height="100%" onClick={onClose}/>
				<Button icon={<FaPlus/>} label={`${button_text} ${selectionString()}`} width="100%" height="100%" onClick={() => onConfirm?.(selectedUsers)}/>
			</div>
		</ModalDialog>
	);
}
