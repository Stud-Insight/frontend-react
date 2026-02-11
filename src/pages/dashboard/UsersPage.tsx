import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import DashboardPage from "./DashboardPage";
import Button from "../../atoms/input/Button";
import InfoBox from "../../components/ui/InfoBox";
import UserService, { User, UserRoles, UserRolesColors, UserRolesLabels} from "../../services/UserService";
import InfoWidget from "../../components/ui/InfoWidget";
import InputCheckbox from "../../components/input/InputCheckbox";
import ConfirmationDialog from "../../components/dialog/ConfirmationDialog";
import ModalDialog from "../../components/dialog/ModalDialog";
import InputField from "../../components/input/InputField";
import OverflowMenu from "../../components/input/OverflowMenu";
import UserAvatar from "../../components/ui/UserAvatar";
import TagWidget from "../../atoms/ui/Tag";
import InputTagSelection from "../../components/input/InputTagSelection";
import ImportCSVButton from "../../components/button/ImportCSVButton";
import HorizontalDivider from "../../components/ui/HorizontalDivider";

import { CgImport } from "react-icons/cg";
import { IoPricetagOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { FaPlus } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { IoBan } from "react-icons/io5";
import { FiUser, FiMail } from "react-icons/fi";

import "./UsersPage.css";
import "./DashboardPage.css";
import ContainerWidget from "../../components/ui/ContainerWidget";

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
	const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
	const [prenom, setPrenom] = useState<string>("");
	const [nom, setNom] = useState<string>("");
	const [mail, setMail] = useState<string>("");
	const [roles, setRoles] = useState<Set<string>>(new Set());

	const isArchived = true;

	const fileInputRef = useRef<HTMLInputElement | null>(null);	
	const modalWidth: number = 500;

	let filteredUsers: User[] = page != null ? (users?.filter((user) => {
		if (page == UserRoles.RESPO_STAGE || page == UserRoles.RESPO_TER){
			return user.groups.some(roles => {
				return roles.name == UserRoles.RESPO_STAGE || roles.name == UserRoles.RESPO_TER;
			});
		} else {
			return user.groups.some(roles => roles.name == page);
		}
	})) : users;

	const userRoles: UserRoles[] = [
		UserRoles.ETUDIANT,
		UserRoles.EXTERNE,
		UserRoles.ENCADRANT,
		UserRoles.RESPO_STAGE,
		UserRoles.RESPO_TER,
		UserRoles.ADMIN
	]
	const getCountData = () => {
		let countMap: Map<string, number> = new Map<string, number>();

		userRoles.map((role) => {
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
			await UserService.createUser(nom, prenom, mail, roles);
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
		setRoles(new Set());
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

	const editHandle = async () => {
		try {
			await UserService.updateUser(editUser?.id, prenom, nom, mail, roles);
			setSuccess(`Utilisateur "${prenom} ${nom}" a été modifié.`);
		
			if (editUser?.id == g?.id) {
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
		setRoles(new Set());
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
	
	const fileSelectionHandle = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.name.endsWith(".csv")) {
			setError("Veuillez sélectionner un fichier CSV.");
			return;
		}

		try {
			await UserService.importUserCSV(file);
			setSuccess(`Fichier "${file.name}" importé avec succès.`);
			getAllUsers();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const addRole = (role: string) => {
		setRoles(prev => new Set(prev).add(role));
	};

	const removeRole = (role: string) => {
		setRoles(prev => {
			const next = new Set(prev);
			next.delete(role);
			return next;
		});
	};

	useEffect(() => {
		getAllUsers();
	}, [page]);
	
	return (
		<DashboardPage>
			{createUser && 
				<ModalDialog label="Creation Utilisateur" onClose={() => setCreateUser(false)}>
					<InputField value={prenom} icon={<FiUser/>} label="Prenom" onChange={setPrenom}/>
					<InputField value={nom} icon={<FiUser/>} label="Nom" onChange={setNom}/>
					<InputField value={mail} icon={<FiMail/>} label="E-Mail" type="email" onChange={setMail}/>
					<InputTagSelection label="Rôles" icon={<IoPricetagOutline/>} alwaysShow={true} tags={roles} options={userRoles} onSelect={addRole} onDelete={removeRole}/>
					<Button icon={<FaPlus/>} label="Créer" onClick={createHandle}/>
				</ModalDialog>
			}

			{editUser && 
				<ModalDialog label="Modification Utilisateur" onClose={() => setEditUser(null)} >
					<InputField value={prenom} icon={<FiUser/>} label="Prenom" onChange={setPrenom}/>
					<InputField value={nom} icon={<FiUser/>} label="Nom" onChange={setNom}/>
					<InputTagSelection label="Rôles" icon={<IoPricetagOutline/>} alwaysShow={true} tags={roles} options={userRoles} onSelect={addRole} onDelete={removeRole}/>
					<Button icon={<MdOutlineEdit/>} label="Modifier" onClick={editHandle}/>
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
					<ImportCSVButton onSelect={(e) => fileSelectionHandle(e)}/>
					<Button icon={<FaPlus/>} label="Créer Utilisateur" onClick={() => {
						setMail("");
						setPrenom("");
						setNom("");
						if (page != null) {
							setRoles(new Set([page]));
						}
						setCreateUser(true);
					}}/>
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
						<th>ID</th>
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
									<UserAvatar user={user} />
								</div>
							</td>
							<td>
								<label>{`#${user.id.slice(0, 8)}`}</label>
							</td>
							<td>
								<label>{user.first_name} {user.last_name}</label>
							</td>
							<td>{user.email}</td>
                            <td>{dateFormat(user.date_joined)}</td>
                            <td>{user.last_login ? dateFormat(user.last_login): "?"}</td>
							<td>
								<div className="users-table-tag-layout">
									{user.groups.map((roles, index) => (
										<TagWidget label={UserRolesLabels.get(roles.name)} color={UserRolesColors.get(roles.name)}/>
									))}
								</div>
							</td>

							<td>
								<OverflowMenu options={[
									{label: "Modifier", icon: <MdOutlineEdit/>, onClick: () => {
										setEditUser(user);
										setMail(user.email);
										setPrenom(user.first_name);
										setNom(user.last_name);

										setRoles(new Set(
											user.groups.map(group => group.name)
										));

										setEditUser(user);
									}},

									...((g.id != user.id) ? 
										[{label: "Bloquer", icon: <IoBan/>, onClick: () => {
												setBlockUser(user);
											}},
											
											{label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => {
												setDeleteUser(user);
											}}]
										:
										[])
								]}/>
							</td>
                        </tr>
                    ))}
                </tbody>
            </table>
		</DashboardPage>	
	)
}