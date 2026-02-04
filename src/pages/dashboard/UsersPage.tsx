import React, { useState, useEffect, useRef } from "react";
import DashboardPage from "./DashboardPage";
import SubmitButton from "../../atoms/input/Button";
import InfoBox from "../../components/ui/InfoBox";
import UserService, { User, UserRoles } from "../../services/UserService";
import InfoWidget from "../../components/ui/InfoWidget";
import InputCheckbox from "../../components/input/InputCheckbox";
import IconButton from "../../components/button/IconButton";
import ConfirmationDialog from "../../components/dialog/ConfirmationDialog";
import ModalDialog from "../../components/dialog/ModalDialog";
import InputField from "../../components/input/InputField";
import InputDropdown from "../../components/input/InputDropdown"
import { LuMessageSquare } from "react-icons/lu";
import { CgExport, CgImport } from "react-icons/cg";
import { FaEllipsis } from "react-icons/fa6";
import { IoPricetagOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { FaPlus } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { IoBan } from "react-icons/io5";
import { FiUser, FiMail } from "react-icons/fi";

import UserAvatar from "../../components/ui/UserAvatar";
import TagWidget from "../../atoms/ui/Tag";

import "./UsersPage.css"
import "./DashboardPage.css"

export default function UsersPage(){
	const { user, refreshUser } = useAuth();
	const g = user;
	const [page, setPage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [users, setUsers] = useState<User[] | null>([]);
	const [deleteUser, setDeleteUser] = useState<User | null>(null);
	const [createUser, setCreateUser] = useState<boolean>(false);
	const [editUser, setEditUser] = useState<User | null>(null);
	const [blockUser, setBlockUser] = useState<User | null>(null);
	const [selectedUsers, setSelectedUsers] = useState(new Set([]));
	const [prenom, setPrenom] = useState<string>("");
	const [nom, setNom] = useState<string>("");
	const [mail, setMail] = useState<string>("");
	const [role, setRole] = useState<string>("");

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const roles: string[] = [
		UserRoles.ETUDIANT,
		UserRoles.RESPO_TER,
		UserRoles.RESPO_STAGE, 
		UserRoles.ENCADRANT, 
		UserRoles.EXTERNE,
		UserRoles.ADMIN, 
	]

	const tagRoleMap = new Map<string, string>([
		[UserRoles.ETUDIANT, "--blue-col"],
		[UserRoles.RESPO_TER, "--purple-col"],
		[UserRoles.RESPO_STAGE, "--purple-col"],
		[UserRoles.ENCADRANT, "--purple-col"],
		[UserRoles.EXTERNE, "--orange-col"],
		[UserRoles.ADMIN, "--red-col"],
	]);

	const modalWidth: number = 500;

	let filteredUsers: User[] = page != null ? (users?.filter((user) => {
		return user.groups.some(role => role.name == page);
	})) : users;

	const getCountData = () => {
		let countMap: Map<string, number> = new Map<string, number>();

		roles.forEach(role => {
			countMap.set(role, 0);
		});

		{users && users.map((user, index) => (
			user.groups.map((group, index1) => {
				let t: number | undefined = countMap.get(group.name);
				if (t != undefined){
					countMap.set(group.name, t + 1);
				}
			})
		))}

		return countMap;
	};

	const getAllUsers = async () => {
		try {
			let data = await UserService.getAllUsers();
			setUsers(data);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const userSelectionHandle = (id: string) => {
		setSelectedUsers(prev => {
			const newSet = new Set(prev);

			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}

			return newSet;
		});
	};

	const deleteHandle = async () => {
		try {
			await UserService.deleteUser(deleteUser?.id);
			setSuccess(`Utilisateur "${deleteUser?.first_name} ${deleteUser?.last_name}" a été supprimé du système.`);
			setTimeout(() => setSuccess(null), 5000);
			getAllUsers();
		} catch(err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
		setDeleteUser(null);
	}

	const createHandle = async () => {
		try {
			await UserService.createUser([role], nom, prenom, mail);
			setSuccess(`Utilisateur "${prenom} ${nom}" a été ajouté au système.`);
			setTimeout(() => setSuccess(null), 5000);
			getAllUsers();
		} catch(err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}

		setMail("");
		setPrenom("");
		setNom("");
		setRole("");
		setCreateUser(false);
	}

	const blockHandle = async () => {
		try {

		} catch(err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}

		setBlockUser(null);
	}

	const editHandlePreload = (user: User) => {
		setEditUser(user);
		setMail(user.email);
		setPrenom(user.first_name);
		setNom(user.last_name);

		if (user.groups.length > 0){
			setRole(user.groups[0].name);
		}
	}

	const editHandle = async () => {
		try {
			await UserService.updateUser(editUser?.id, prenom, nom, mail, [role]);
			setSuccess(`Utilisateur "${prenom} ${nom}" a été modifié.`);
		
			if (editUser?.id == g?.id) {
				console.log("elelel");
				await refreshUser();
			}

			setTimeout(() => setSuccess(null), 5000);
			getAllUsers();
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}

		setMail("");
		setPrenom("");
		setNom("");
		setRole("");
		setEditUser(null);
	}

	const dateFormat = (dateString: string) => {
		const date_t = new Date(dateString);

        return date_t.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
	}
	
	const fileSelectionHandle = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.name.endsWith(".csv")) {
			setError("Veuillez sélectionner un fichier CSV.");
			return;
		}

		try {
			await UserService.importUserCSV(file);
			setSuccess(`Fichier ${file.name} importé avec succès.`);
			getAllUsers();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	useEffect(() => {
		getAllUsers();
	}, [page]);
	
	return (
		<DashboardPage>
			<input ref={fileInputRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => fileSelectionHandle(e)}/>

			{createUser && 
				<ModalDialog label="Creation Utilisateur" onClose={() => setCreateUser(false)} width={modalWidth}>
					<InputField value={prenom} icon={<FiUser/>} label="Prenom" onChange={setPrenom}/>
					<InputField value={nom} icon={<FiUser/>} label="Nom" onChange={setNom}/>
					<InputField value={mail} icon={<FiMail/>} label="E-Mail" type="email" onChange={setMail}/>
					<InputDropdown label="Rôle" icon={<IoPricetagOutline/>} value={role} options={roles} onChange={setRole}/>
					<SubmitButton icon={<FaPlus/>} label="Créer" onChange={createHandle}/>
				</ModalDialog>
			}

			{editUser && 
				<ModalDialog label="Modification Utilisateur" onClose={() => setEditUser(null)} width={modalWidth}>
					<InputField value={prenom} icon={<FiUser/>} label="Prenom" onChange={setPrenom}/>
					<InputField value={nom} icon={<FiUser/>} label="Nom" onChange={setNom}/>
					<InputDropdown label="Rôle" icon={<IoPricetagOutline/>} value={role} options={roles} onChange={setRole}/>
					<SubmitButton icon={<MdOutlineEdit/>} label="Modifier" onChange={editHandle}/>
				</ModalDialog>
			}

			{blockUser &&
				<ConfirmationDialog 
					label="Bloquer cet utilisateur?" 
					info={`L'utilisateur "${blockUser.first_name} ${blockUser.last_name}" sera bloqué et ne pourra plus se connecter au serveur. Êtes-vous sûr de vouloir poursuivre cette action ?`}
					onCancel={() => setBlockUser(null)} 
					onConfirm={blockHandle}
				/>
			}

			{deleteUser &&
				<ConfirmationDialog 
					label="Supprimer cet utilisateur?" 
					info={`L'utilisateur "${deleteUser.first_name} ${deleteUser.last_name}" sera surpprimé définitivement de la base de donnée. Cette action est irréversible et entraînera la perte de toutes les données associées.`}
					onCancel={() => setDeleteUser(null)} 
					onConfirm={deleteHandle}
				/>
			}

			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Gestion Utilisateurs</label>
				</div>

				<div className="dashboard-top-button-layout">
					<div style={{width: "auto"}}>
						<SubmitButton icon={<CgImport/>} label="Importer CSV" onChange={() => fileInputRef.current?.click()}/>
					</div>

					<div style={{width: "auto"}}>
						<SubmitButton icon={<FaPlus/>} label="Créer Utilisateur" onChange={() => setCreateUser(true)}/>
					</div>
				</div>
			</div>

			<label style={{color: "var(--gray1-col)"}}>Gérez les comptes utilisateurs, leurs rôles et leurs accès à la plateforme.</label>

			{error && <InfoBox label={error} type="error"/>}
			{success && <InfoBox label={success} type="success"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Utilisateurs" icon={<FiUser/>} active={page == null} info={users ? users?.length : 0} color={`var(--blue-col)`} onClick={() => setPage(null)}/>
				<InfoWidget label="Étudiants" icon={<FiUser/>} active={page == UserRoles.ETUDIANT} info={getCountData().get(UserRoles.ETUDIANT)} color="var(--blue-col)" onClick={() => setPage(UserRoles.ETUDIANT)}/>
				<InfoWidget label="Externes" icon={<FiUser/>} active={page == UserRoles.EXTERNE} info={getCountData().get(UserRoles.EXTERNE)} color="var(--orange-col)" onClick={() => setPage(UserRoles.EXTERNE)}/>
			</div>

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Encadrants" icon={<FiUser/>} active={page == UserRoles.ENCADRANT} info={getCountData().get(UserRoles.ENCADRANT)} color="var(--purple-col)" onClick={() => setPage(UserRoles.ENCADRANT)}/>
				<InfoWidget label="Résponsables" icon={<FiUser/>} active={page == UserRoles.RESPO_STAGE || page == UserRoles.RESPO_TER} info={getCountData().get(UserRoles.RESPO_STAGE) + getCountData().get(UserRoles.RESPO_TER)} color="var(--purple-col)" onClick={() => setPage(UserRoles.RESPO_TER)}/>
				<InfoWidget label="Administrateurs" icon={<FiUser/>} active={page == UserRoles.ADMIN} info={getCountData().get(UserRoles.ADMIN)} color="var(--red-col)" onClick={() => setPage(UserRoles.ADMIN)}/>
			</div>

			<table className="users-table-style">
                <thead>
                    <tr>
                        <th><InputCheckbox/></th>
						<th>Profile</th>
						<th>Nom</th>
						<th>E-Mail</th>
                        <th>Dâte Activation</th>
                        <th>Dâte Connexion</th>
						<th>Rôle</th>
						<th></th>
                    </tr>
                </thead>
                <tbody>
		 			{filteredUsers && filteredUsers.map((user, index) => (
                        <tr key={index}>
                            <td>
								<InputCheckbox value={selectedUsers.has(user.id)} onChange={() => userSelectionHandle(user.id)}/>
							</td>
                            <td>
								<div className="users-table-avatar-container">
									<UserAvatar user={user}/>
								</div>
							</td>
							<td>
								<div className="users-table-user-info">
									<label>{user.first_name} {user.last_name}</label>
									<label style={{color: "var(--gray1-col)"}}>{user.id.slice(0, 8)}</label>
								</div>
							</td>
							<td>{user.email}</td>
                            <td>{dateFormat(user.date_joined)}</td>
                            <td>{user.last_login ? dateFormat(user.last_login): "?"}</td>
							<td>
								<div className="users-table-tag-layout">
									{user.groups.map((role, index) => (
										<TagWidget label={role.name} color={`var(${tagRoleMap.get(role.name)})`}/>
									))}
								</div>
							</td>

							<td>
								<IconButton icon={<FaEllipsis/>}/>
							</td>
                        </tr>
                    ))}
                </tbody>
            </table>
		</DashboardPage>	
	)
}