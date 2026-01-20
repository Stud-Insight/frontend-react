import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage.tsx";
import UserService, {User} from "../../services/UserService.ts";
import PermissionTag from "../../components/ui/PermissionTag.tsx";
import ModalDialog from "../../components/input/ModalDialog.tsx";
import InputField from "../../components/input/InputField.tsx";
import InputDropdown from "../../components/input/InputDropdown.tsx";
import SubmitButton from "../../components/input/SubmitButton.tsx";

import "./UsersPage.css"
import "./DashboardPage.css"

export default function UsersPage(){
	const [users, setUsers] = useState<User[]>([]);
	const [showModal, setShowModal] = useState(false);

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
				console.error(err);
			}
		};

		fetchUsers();
	}, []);

	const role_list = ["Etudiant", "Enseignant(e)", "Administrateur", "Extern"];

	const open_modal_handler = () => {
		setShowModal(!showModal);
	}

	const add_user_hanlder = () => {
		console.log("Ajout du user: ");
		console.log(role);
		console.log(prenom);
		console.log(nom);
		console.log(email);
		console.log(mdp);

		// setRole("");
		// setPrenom("");
		// setNom("");
		// setEmail("");
		// setMdp("");
		setShowModal(false);
	}

    return (
        <DashboardPage>
            <label>Utilisateurs ({users.length})</label>

            <table className="users-table-style">
                <thead>
                    <tr>
                        <th></th>
						<th>Prenom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Date Activation</th>
                        <th>Dernière Connection</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td><input type="checkbox" className="checkbox-users-selection"></input></td>
                            <td>{user.first_name}</td>
							<td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{"eelele"}</td>
                            <td>{"eelele"}</td>
                            <td><PermissionTag perm={"etu"}/></td>
                        </tr>
                    ))}
                </tbody>
            </table>

			<SubmitButton label="Créer un utilisateur" onChange={open_modal_handler}/>

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