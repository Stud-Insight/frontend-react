import React, {useState} from "react";
import { User } from "../../../services/UserService";
import { Group } from "../../../services/GroupService";
import GroupProjectWidget from "../../../components/objects/GroupProjectWidget";
import Button from "../../../atoms/input/Button";
import ModalDialog from "../../../components/dialog/ModalDialog";
import InputField from "../../../components/input/InputField";
import InputNumberField from "../../../components/input/InputNumberField";
import InputUserSelection from "../../../components/input/InputUserSelection";

import { FaPlus } from "react-icons/fa";

interface TERGroupViewProps {
	groups: Group[];
	students: User[];
	onAdd?: (nom: string, size: number, users: Set<User>) => void;
};

export default function TERGroupView({groups, students, onAdd}: TERGroupViewProps){
	const [addingGroup, setAddingGroup] = useState<boolean>(false);
	const [editGroup, setEditGroup] = useState<Group | null>(null);
	const [groupNom, setGroupNom] = useState<string>("");
	const [groupTaille, setGroupTaille] = useState<number>(0);
	const [groupUsers, setGroupUsers] = useState<Set<User>>(new Set());

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

	const addGroupHandle = () => {
		onAdd?.(groupNom, groupTaille, groupUsers);
		setGroupNom("");
		setGroupTaille(0);
		setAddingGroup(false);
	};

	return (
		<>
			{addingGroup &&
				<ModalDialog label="Creation Groupe" onClose={resetFields}>
					<InputField label="Nom" value={groupNom} onChange={setGroupNom}/>
					<InputNumberField label="Taille" value={groupTaille} onChange={setGroupTaille} min={0} max={4}/>
					<InputUserSelection label="Membres" users={students} maxSelection={groupTaille} onChange={(users) => setGroupUsers(users)}/>
					<Button label="Confirmer" onClick={addGroupHandle}/>
				</ModalDialog>
			}

			{editGroup &&
				<ModalDialog label="Modifier Groupe" onClose={resetFields}>
					<InputField label="Nom" value={groupNom} onChange={setGroupNom}/>
					<InputNumberField label="Taille" value={groupTaille} onChange={setGroupTaille} min={0} max={4}/>
					<InputUserSelection label="Membres" users={students} maxSelection={groupTaille} onChange={(users) => setGroupUsers(users)}/>
					<Button label="Modifier"/>
				</ModalDialog>
			}

			<div className="dashboard-top-layout">
				<div/>
				<div className="dashboard-top-button-layout">
					<Button icon={<FaPlus/>} label="Créer Groupe" onClick={() => setAddingGroup(true)}/>
				</div>
			</div>

			{groups.map(group => (
				<GroupProjectWidget key={group.id} group={group} onEdit={() => editHandle(group)}/>
			))}
		</>
	)
}