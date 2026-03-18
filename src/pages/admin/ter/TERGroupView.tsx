import React, {useState} from "react";
import { User } from "../../../services/UserService";
import { Group } from "../../../services/GroupService";
import GroupProjectWidget from "../../../components/objects/GroupProjectWidget";
import Button from "../../../atoms/input/Button";
import ModalDialog from "../../../components/dialog/ModalDialog";
import InputField from "../../../components/input/InputField";
import InputNumberField from "../../../components/input/InputNumberField";
import InputUserSelection from "../../../components/input/InputUserSelection";
import ConfirmationDialog from "../../../components/dialog/ConfirmationDialog";

import { FaPlus } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";

interface TERGroupViewProps {
	groups: Group[];
	students: User[];
	readOnly?: boolean;
	onAdd?: (nom: string, size: number) => void;
	onDelete?: (group: Group) => void;
	onUpdate?: (group: Group, name: string, size: number) => void;
	onUserDelete?: (group: Group, user: User) => void;
	onAddUsers?: (group: Group, users: Set<User>) => void;
	onChangeLeader?: (group: Group, user: User) => void;
};

interface DeleteUserGroup {
	user: User;
	group: Group;
};

export default function TERGroupView({groups, students, readOnly, onAdd, onDelete, onAddUsers, onChangeLeader, onUserDelete, onUpdate}: TERGroupViewProps){
	const [addingGroup, setAddingGroup] = useState<boolean>(false);
	const [addingUser, setAddingUser] = useState<Group | null>(null);
	const [editGroup, setEditGroup] = useState<Group | null>(null);
	const [deleteGroup, setDeleteGroup] = useState<Group | null>(null);
	const [groupNom, setGroupNom] = useState<string>("");
	const [groupTaille, setGroupTaille] = useState<number>(0);
	const [selectedUsers, setSelectedUsers] = useState<Set<User>>(new Set([]));
	const [deleteUser, setDeleteUser] = useState<DeleteUserGroup | null>(null);
	const [leader, setLeader] = useState<DeleteUserGroup | null>(null);

	const sortedGroups = groups.sort((a, b) => (
		a.name.localeCompare(b.name)
	))

	const resetFields = () => {
		setGroupNom("");
		setGroupTaille(0);
		setAddingGroup(false);
		setEditGroup(null);
		setDeleteUser(null);
		setDeleteGroup(null);
		setLeader(null);
		setAddingUser(null);
		setSelectedUsers(new Set());
	};
	
	const editHandle = (g: Group) => {
		setGroupNom(g.name);
		setGroupTaille(g.max_group_size);
		setEditGroup(g);
	};

	const removeUserGroupHandle = () => {
		onUserDelete?.(deleteUser.group, deleteUser.user)
		resetFields();
	}

	const addGroupHandle = () => {
		onAdd?.(groupNom, groupTaille);
		setGroupNom("");
		setGroupTaille(0);
		setAddingGroup(false);
	};
	
	const updateGroupHandle = () => {
		onUpdate?.(editGroup, groupNom, groupTaille);
		resetFields();
	}

	const deleteGroupHandle = () => {
		onDelete?.(deleteGroup);
		resetFields();
	}

	const addUserHandle = () => {
		onAddUsers?.(addingUser, selectedUsers);
		resetFields();
	}

	const addUserHandlePre = (g: Group) => {
		resetFields();
		setAddingUser(g);
	}

	const changeLeaderHandle = () => {
		onChangeLeader?.(leader?.group, leader?.user);
		resetFields();
	}

	return (
		<>
			{addingGroup &&
				<ModalDialog label="Creation Groupe" onClose={resetFields} className="group-view-selection-modal">
					<InputField label="Nom" value={groupNom} onChange={setGroupNom}/>
					<InputNumberField label="Taille" value={groupTaille} onChange={setGroupTaille} min={0} max={4}/>
					<Button icon={<FaPlus/>} label="Confirmer" onClick={addGroupHandle}/>
				</ModalDialog>
			}

			{addingUser &&
				<ModalDialog label="Ajouter Étudiants" onClose={resetFields} className="group-view-selection-modal">
					<InputUserSelection value={selectedUsers} label="Membres" users={students} onChange={setSelectedUsers} maxSelection={addingUser.max_group_size - addingUser.member_count}/>
					<Button icon={<FaPlus/>} label={`Ajouter (${selectedUsers.size})`} onClick={addUserHandle}/>
				</ModalDialog>
			}

			{editGroup &&
				<ModalDialog label="Modifier Groupe" onClose={resetFields} className="group-view-selection-modal">
					<InputField label="Nom" value={groupNom} onChange={setGroupNom}/>
					<InputNumberField label="Taille" value={groupTaille} onChange={setGroupTaille} min={0} max={4}/>
					<Button icon={<MdOutlineEdit/>} label="Modifier" onClick={updateGroupHandle}/>
				</ModalDialog>
			}

			{deleteUser &&
				<ConfirmationDialog 
				label="Supprimer Étudiant" 
				onCancel={() => setDeleteUser(null)}
				onConfirm={removeUserGroupHandle}
				info={`Êtes-vous sûr de vouloir supprimer "${deleteUser.user.first_name} ${deleteUser.user.last_name}" du groupe "${deleteUser.group.name}"?`}/>
			}

			{deleteGroup &&
				<ConfirmationDialog 
				label="Supprimer Groupe" 
				onCancel={() => setDeleteGroup(null)}
				onConfirm={deleteGroupHandle}
				info={`Êtes-vous sûr de vouloir supprimer le groupe "${deleteGroup.name}"?`}/>
			}

			{leader &&
				<ConfirmationDialog 
				label="Changement Chef" 
				onCancel={() => setLeader(null)}
				onConfirm={changeLeaderHandle}
				info={`Êtes-vous sûr de vouloir changer "${leader.user.first_name} ${leader.user.last_name}" en responsable du groupe "${leader.group.name}"?`}/>
			}

			{!readOnly &&
				<div className="dashboard-top-layout">
					<div/>
					<div className="dashboard-top-button-layout">
						<Button icon={<FaPlus/>} label="Créer Groupe" onClick={() => setAddingGroup(true)}/>
					</div>
				</div>
			}

			{sortedGroups.map(group => (
				<GroupProjectWidget key={group.id} group={group}
				onDelete={!readOnly ? () => setDeleteGroup(group) : undefined}
				onEdit={!readOnly ? () => editHandle(group) : undefined}
				onUserDelete={!readOnly ? (user => setDeleteUser({user: user, group: group})) : undefined}
				onLeader={!readOnly ? (user => setLeader({user: user, group: group})) : undefined}
				onAdd={!readOnly ? () => addUserHandlePre(group) : undefined}
				/>
			))}
		</>
	)
}