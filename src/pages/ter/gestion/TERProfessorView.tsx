import React, {useState} from "react";
import { User, UserRoles } from "../../../services/UserService";
import ImportCSVButton from "../../../components/button/ImportCSVButton";
import UserSelectionDialog from "../../../components/dialog/UserSelectionDialog";

import Button from "../../../atoms/input/Button";
import { FaPlus } from "react-icons/fa";

interface TERProfessorViewProps {
	professors: User[];
	onAdd?: (users: Set<string>) => void;
	onDelete?: () => void;
};

export default function TERProfessorView({professors, onAdd, onDelete}: TERProfessorViewProps){
	const [addingProfesssor, setAddingProfesssor] = useState<boolean>(false);

	return (
		<>
			{addingProfesssor &&
				<UserSelectionDialog 
					label="Ajout encadrants"
					role_filter={[UserRoles.ENCADRANT, UserRoles.EXTERNE, UserRoles.RESPO_TER, UserRoles.RESPO_STAGE, UserRoles.ADMIN]} 
					onClose={() => setAddingProfesssor(false)} 
				/>
			}
			
			<div className="dashboard-top-layout">
				<div>

				</div>

				<div className="dashboard-top-button-layout">
					<ImportCSVButton/>
					<Button icon={<FaPlus/>} label="Ajouter Enseignant" onClick={() => setAddingProfesssor(true)}/>
				</div>
			</div>

			<table className="users-table-style">
				<thead>
					<tr>
						<th>Profile</th>
						<th>Nom</th>
						<th>E-Mail</th>
						<th>Groupe</th>
						<th>Sujet</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					
				</tbody>	
			</table>
		</>
	)
}