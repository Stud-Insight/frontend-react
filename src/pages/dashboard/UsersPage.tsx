import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import DashboardPage from "./DashboardPage.tsx";
import UserService, {User} from "../../services/UserService.ts";
import PermissionTag from "../../components/ui/PermissionTag.tsx";
import ModalDialog from "../../components/input/ModalDialog.tsx";
import InputField from "../../components/input/InputField.tsx";
import InputDropdown from "../../components/input/InputDropdown.tsx";
import SubmitButton from "../../components/input/SubmitButton.tsx";
import InputCheckbox from "../../components/input/InputCheckbox.tsx";
import InfoBox from "../../components/ui/InfoBox.tsx";
import ConfirmationDialog from "../../components/input/ConfirmationDialog.tsx";

import "./UsersPage.css"
import "./DashboardPage.css"

export default function UsersPage(){
	const [users, setUsers] = useState<User[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [checkAll, setCheckAll] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
	const [userDelete, setUserDelete] = useState<User | null>(null);
	const [role, setRole] = useState("");
	const [prenom, setPrenom] = useState("");
	const [nom, setNom] = useState("");
	const [email, setEmail] = useState("");
	const [mdp, setMdp] = useState("");

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const data = await UserService.getAllUsers();
				setUsers(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erreur");
			}
		};

		fetchUsers();
	}, []);

	const role_list = ["Etudiant", "Enseignant(e)", "Administrateur", "Extern"];

	const open_modal_handler = () => {
		setShowModal(!showModal);
	}

	const add_user_hanlder = async () => {
		try {
			await UserService.createUser(role, nom, prenom, email, mdp);
			setRole("");
			setPrenom("");
			setNom("");
			setEmail("");
			setMdp("");
			setShowModal(false);
		} catch (err){
			setError(err instanceof Error ? err.message : "Erreur");
		}
	}

	const user_selection_handler = (user_id: string) => {
		setSelectedUsers(prev => {
			const next = new Set(prev);

			if (next.has(user_id)) {
				next.delete(user_id);
			} else {
				next.add(user_id);
			}

			return next;
		});

		setCheckAll(false);
	}

	const user_checkall_handler = () => {
 		if (checkAll) {
			setSelectedUsers(new Set());
		} else {
			setSelectedUsers(new Set(users.map(user => user.id)));
		}

    	setCheckAll(!checkAll);
	}

	const open_delete_handler = (user_id: User) => {
		setUserDelete(user_id);
	}

	const delete_user_handler = async () => {
		try {
			UserService.deleteUser(userDelete?.id);
			setUserDelete(null);
		} catch (err){
			setError(err instanceof Error ? err.message : "Erreur");
		}
	}
    return (
        <DashboardPage>
            <label>Utilisateurs ({users.length})</label>

			{error && <InfoBox label={error} type="error"/>}
            <table className="users-table-style">
                <thead>
                    <tr>
                        <th><InputCheckbox value={checkAll} onChange={user_checkall_handler}/></th>
						<th>Nom</th>
                        <th>E-Mail</th>
                        <th>Date Activation</th>
                        <th>Dernière Connexion</th>
                        <th>Rôle</th>
						<th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td><InputCheckbox value={selectedUsers.has(user.id)} onChange={() => user_selection_handler(user.id)}/></td>
                            <td>{user.first_name} {user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{"test"}</td>
                            <td>{"test"}</td>
                            <td><PermissionTag perm={`${user.is_superuser ? "admin" : "etu"}`}/></td>
							<td><RxCross2 size={20} onClick={() => open_delete_handler(user)}/></td>
                        </tr>
                    ))}
                </tbody>
            </table>

			<SubmitButton label="Créer un utilisateur" onChange={open_modal_handler}/>

			{userDelete &&
				<ConfirmationDialog 
				label="Supprimer cet utilisateur ?"
				info={`L'utilisateur "${userDelete.first_name} ${userDelete.last_name}" sera surpprimé de la base de donnée. Cette action est irréversible et entraînera la perte de toutes les données associées.`}
				onCancel={() => setUserDelete(null)}
				onConfirm={delete_user_handler}
				/>
			}
			
			{showModal && 
				<ModalDialog label="Utilisateur" onClose={open_modal_handler}>
					<InputDropdown label={"Rôle"} options={role_list} onChange={setRole}/>
					<InputField label={"Prenom"} value={prenom} onChange={setPrenom}/>
					<InputField label={"Nom"} value={nom} onChange={setNom}/>
					<InputField label={"E-Mail"} value={email} onChange={setEmail}/>
					<InputField label={"Mot de passe"} value={mdp} onChange={setMdp}/>
					<SubmitButton label="Créer Utilisateur" onChange={add_user_hanlder}/>
				</ModalDialog>
			}
        </DashboardPage>
    )
}