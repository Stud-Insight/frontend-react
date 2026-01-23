import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage";
import SubmitButton from "../../components/input/SubmitButton";
import InfoBox from "../../components/ui/InfoBox";
import UserService, { User } from "../../services/UserService";
import InfoWidget from "../../components/ui/InfoWidget";
import InputCheckbox from "../../components/input/InputCheckbox";
import UserWidget from "../../components/objects/UserWidget";
import IconButton from "../../components/input/IconButton";
import ConfirmationDialog from "../../components/input/ConfirmationDialog";

import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { IoBan } from "react-icons/io5";
import { FiUser } from "react-icons/fi";

import "./UsersPage.css"
import "./DashboardPage.css"

export default function UsersPage(){
	const [error, setError] = useState<string | null>(null);
	const [users, setUsers] = useState<User[] | null>([]);
	const [deleteUser, setDeleteUser] = useState<User | null>(null);

	useEffect(() => {
		const getAllUsers = async () => {
			try {
				const data = await UserService.getAllUsers();
				setUsers(data);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		getAllUsers();
	}, [users]);

	const deleteHandle = async (user: User) => {
		try {
			setDeleteUser(null);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}
	
	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Utilisateurs</label>
				</div>
			
				<div className="dashboard-top-button-layout">
					<SubmitButton label="Créer un utilisateur"/>
				</div>
			</div>

			<label style={{color: "var(--gray1-col)"}}>Gestion des utilisateurs.</label>

			{error && <InfoBox label={error} type="error"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Utilisateurs" icon={<FiUser/>} info={users ? users?.length : 0} color="var(--blue-col)"/>
				<InfoWidget label="Etudiants" icon={<FiUser/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Enseignant" icon={<FiUser/>} info={0} color="var(--purple-col)"/>
				<InfoWidget label="Extern" icon={<FiUser/>} info={0} color="var(--orange-col)"/>
				<InfoWidget label="Administrateur" icon={<FiUser/>} info={0} color="var(--red-col)"/>
			</div>

			<table className="users-table-style">
                <thead>
                    <tr>
                        <th><InputCheckbox/></th>
						<th>Profile</th>
						<th>Role</th>
                        <th>Date Activation</th>
                        <th>Dernière Connexion</th>
						<th>Actions</th>
                    </tr>
                </thead>
                <tbody>
		 			{users.map((user, index) => (
                        <tr key={index}>
                            <td><InputCheckbox/></td>
                            <td><UserWidget user={user}/></td>
							<td>Admin</td>
                            <td>{"test"}</td>
                            <td>{"test"}</td>
							<td>
								<div className="users-table-options">
									<IconButton icon={<MdOutlineEdit/>}/>
									<IconButton icon={<IoBan/>}/>
									<IconButton icon={<MdDeleteOutline/>} onClick={() => setDeleteUser(user)}/>
								</div>
							</td>
                        </tr>
                    ))}
                </tbody>
            </table>

			{deleteUser &&
				<ConfirmationDialog 
					label="Supprimer cet utilisateur?" 
					info={`L'utilisateur ${deleteUser.first_name} ${deleteUser.last_name} sera surpprimé définitivement de la base de donnée. Cette action est irréversible et entraînera la perte de toutes les données associées.`}
					onCancel={() => setDeleteUser(null)} 
					onConfirm={deleteHandle}
				/>
			}

		</DashboardPage>	
	)
}