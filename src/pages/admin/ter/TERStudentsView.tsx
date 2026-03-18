import React, {useState} from "react";
import ImportCSVButton from "../../../components/button/ImportCSVButton";
import { User, UserRoles } from "../../../services/UserService";
import { FaPlus } from "react-icons/fa6";
import UserSelectionDialog from "../../../components/dialog/UserSelectionDialog";
import ConfirmationDialog from "../../../components/dialog/ConfirmationDialog";
import Button from "../../../atoms/input/Button";
import UserAvatar from "../../../components/ui/UserAvatar";
import { LuSend } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import OverflowMenu from "../../../components/input/OverflowMenu";

interface TERStudentViewProps {
	students: User[];
	readOnly?: boolean;
	onAdd?: (users: Set<string>) => void;
	onDelete?: (user: User) => void;
	onContact?: (user: User) => void;
};

export default function TERStudentView({students, readOnly, onAdd, onDelete, onContact}: TERStudentViewProps){
	const [addingStudent, setAddingStudent] = useState<boolean>(false);
	const [deleteStudent, setDeleteStudent] = useState<User | null>(null);

	const addUsersHandle = (users: Set<string>) => {
		onAdd?.(users);
		setAddingStudent(false);
	};

	return (<>
		{addingStudent && 
			<UserSelectionDialog 
				label="Ajout étudiants"
				role_filter={[UserRoles.ETUDIANT]} 
				onClose={() => setAddingStudent(false)} 
				onConfirm={(users) => addUsersHandle(users)}
			/>
		}

		{deleteStudent &&
			<ConfirmationDialog label={"Supprimer étudiant du TER"} onCancel={() => setDeleteStudent(null)} onConfirm={() => {
				onDelete?.(deleteStudent);
				setDeleteStudent(null);
			}} info={`L'étudiant "${deleteStudent.first_name} ${deleteStudent.last_name}" sera supprimé du TER.`}/>
		}
		
		{!readOnly &&
			<div className="dashboard-top-layout">
				<div/>
				<div className="dashboard-top-button-layout">
					<ImportCSVButton/>
					<Button icon={<FaPlus/>} label="Ajouter Étudiant" onClick={() => setAddingStudent(true)}/>
				</div>
			</div>
		}
		
		{students && students.length > 0 &&
			<table className="users-table-style">
				<thead>
					<tr>
						<th>Profil</th>
						<th>Nom</th>
						<th>E-Mail</th>	
						<th></th>
					</tr>
				</thead>
				<tbody>
					{students.map(user => (
						<tr key={user.id}>
							<td>
								<div className="users-table-avatar-container">
									<UserAvatar user={user}/>
								</div>
							</td>
							<td>{user.first_name} {user.last_name}</td>
							<td>{user.email}</td>
							<td>
								<OverflowMenu options={[
									{label: "Contacter", icon: <LuSend/>, onClick: () => {onContact?.(user)}},
									...(!readOnly ? [{label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => {setDeleteStudent(user)}}] : []),
								]}/>
							</td>
						</tr>
					))}
				</tbody>	
			</table>
		}
		</>
	);
}