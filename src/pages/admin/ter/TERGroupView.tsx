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
	onAdd?: (nom: string, size: number, users: Set<User>) => void;
	onDelete?: (group: Group) => void;
	onUserDelete?: (group: Group, user: User) => void;
};

interface DeleteUserGroup {
	user: User;
	group: Group;
};

export default function TERGroupView({groups, students, onAdd, onDelete, onUserDelete}: TERGroupViewProps){
	const [addingGroup, setAddingGroup] = useState<boolean>(false);
	const [editGroup, setEditGroup] = useState<Group | null>(null);
	const [deleteGroup, setDeleteGroup] = useState<Group | null>(null);
	const [groupNom, setGroupNom] = useState<string>("");
	const [groupTaille, setGroupTaille] = useState<number>(0);
	const [groupUsers, setGroupUsers] = useState<Set<User>>(new Set());
	const [deleteUser, setDeleteUser] = useState<DeleteUserGroup | null>(null);

	const sortedGroups = groups.sort((a, b) => (
		a.name.localeCompare(b.name)
	))

	const resetFields = () => {
		setGroupUsers(new Set());
		setGroupNom("");
		setGroupTaille(0);
		setAddingGroup(false);
		setEditGroup(null);
	};

	const editHandle = (g: Group) => {
		setGroupNom(g.name);
		setGroupUsers(new Set(students.filter(stud => (
			g.members.some(us => {
				return us.id == stud.id
			})
		))));

		setGroupTaille(g.max_group_size);
		setEditGroup(g);
	};

	const removeUserGroupHandle = () => {
		onUserDelete?.(deleteUser.group, deleteUser.user)
		setDeleteUser(null);
		resetFields();
	}

	const addGroupHandle = () => {
		onAdd?.(groupNom, groupTaille, groupUsers);
		setGroupNom("");
		setGroupTaille(0);
		setAddingGroup(false);
	};

	const deleteGroupHandle = () => {
		
	}

	return (
		<>
			{addingGroup &&
				<ModalDialog label="Creation Groupe" onClose={resetFields}>
					<InputField label="Nom" value={groupNom} onChange={setGroupNom}/>
					<InputNumberField label="Taille" value={groupTaille} onChange={setGroupTaille} min={0} max={4}/>
					<InputUserSelection label="Membres" users={students} maxSelection={groupTaille} onChange={(users) => setGroupUsers(users)}/>
					<Button icon={<FaPlus/>} label="Confirmer" onClick={addGroupHandle}/>
				</ModalDialog>
			}

			{editGroup &&
				<ModalDialog label="Modifier Groupe" onClose={resetFields}>
					<InputField label="Nom" value={groupNom} onChange={setGroupNom}/>
					<InputNumberField label="Taille" value={groupTaille} onChange={setGroupTaille} min={0} max={4}/>
					<InputUserSelection label="Membres" users={students} maxSelection={groupTaille} onChange={(users) => setGroupUsers(users)}/>
					<Button icon={<MdOutlineEdit/>} label="Modifier"/>
				</ModalDialog>
			}

			{deleteUser &&
				<ConfirmationDialog 
				label="Supprimer Etudiant" 
				onCancel={() => setDeleteUser(null)}
				onConfirm={deleteGroupHandle}
				info={`Etes vous sur de vouloir supprimer "${deleteUser.user.first_name} ${deleteUser.user.last_name}" du groupe "${deleteUser.group.name}"?`}/>
			}

			{deleteGroup &&
				<ConfirmationDialog 
				label="Supprimer Groupe" 
				onCancel={() => setDeleteGroup(null)}
				onConfirm={removeUserGroupHandle}
				info={`Etes vous sur de vouloir supprimer "${deleteGroup.name}"?`}/>
			}

			<div className="dashboard-top-layout">
				<div/>
				<div className="dashboard-top-button-layout">
					<Button icon={<FaPlus/>} label="Créer Groupe" onClick={() => setAddingGroup(true)}/>
				</div>
			</div>

			{sortedGroups.map(group => (
				<GroupProjectWidget key={group.id} group={group} 
				onDelete={() => setDeleteGroup(group)}
				onEdit={() => editHandle(group)} 
				onUserDelete={(user) => setDeleteUser({user: user, group: group})}/>
			))}
		</>
	)
}