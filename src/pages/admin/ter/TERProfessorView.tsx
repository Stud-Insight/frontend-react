import React, {useState} from "react";
import { User, UserRoles } from "../../../services/UserService";
import ImportCSVButton from "../../../components/button/ImportCSVButton";
import UserSelectionDialog from "../../../components/dialog/UserSelectionDialog";
import UserAvatar from "../../../components/ui/UserAvatar";
import OverflowMenu from "../../../components/input/OverflowMenu";
import { LuSend } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import ConfirmationDialog from "../../../components/dialog/ConfirmationDialog";

import Button from "../../../atoms/input/Button";
import { FaPlus } from "react-icons/fa";

interface TERProfessorViewProps {
	professors: User[];
	readOnly?: boolean;
	onAdd?: (users: Set<string>) => void;
	onDelete?: (user: User) => void;
	onContact?: (user: User) => void;
};

export default function TERProfessorView({professors, readOnly, onAdd, onDelete, onContact}: TERProfessorViewProps){
	const [addingProfesssor, setAddingProfesssor] = useState<boolean>(false);
	const [deleteProfessor, setDeleteProfessor] = useState<User | null>(null);

	return (
		<>
			{addingProfesssor &&
				<UserSelectionDialog 
					label="Ajout professeurs"
					role_filter={[UserRoles.ENCADRANT]} 
					onClose={() => setAddingProfesssor(false)} 
					onConfirm={(users) => {
						onAdd?.(users);
						setAddingProfesssor(false);
					}}
				/>
			}

			{deleteProfessor &&
				<ConfirmationDialog label={"Supprime prof du TER"} onCancel={() => setDeleteProfessor(null)} onConfirm={() => {
					onDelete?.(deleteProfessor);
					setDeleteProfessor(null);
				}} info={`Enseignant "${deleteProfessor.first_name} ${deleteProfessor.last_name}" sera supprimé du TER.`}/>
			}
			
			{!readOnly &&
				<div className="dashboard-top-layout">
					<div/>
					<div className="dashboard-top-button-layout">
						<ImportCSVButton/>
						<Button icon={<FaPlus/>} label="Ajouter Professeur" onClick={() => setAddingProfesssor(true)}/>
					</div>
				</div>
			}

			{professors && professors.length > 0 &&
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
						{professors.map((user, index) => (
							<tr key={index}>
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
										...(!readOnly ? [{label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => {setDeleteProfessor(user)}}] : []),
									]}/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			}
		</>
	)
}