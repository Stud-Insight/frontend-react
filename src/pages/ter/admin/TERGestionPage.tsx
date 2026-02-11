import React, {useState, useEffect, ReactNode}from "react";
import DashboardPage from "../../dashboard/DashboardPage";
import InfoWidget from "../../../components/ui/InfoWidget";
import Button from "../../../atoms/input/Button";
import InfoBox from "../../../components/ui/InfoBox";
import UserSelectionDialog from "../../../components/dialog/UserSelectionDialog";
import TagWidget from "../../../atoms/ui/Tag";
import ImportCSVButton from "../../../components/button/ImportCSVButton";
import TERService, { TERPeriod, TERStatusLabel  } from "../../../services/TERService";
import IconButton from "../../../components/button/IconButton";
import UserAvatar from "../../../components/ui/UserAvatar";

import { TbSchool } from "react-icons/tb";
import { FaRegFile } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { User, UserRoles } from "../../../services/UserService";
import { useParams } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";

import "./TERGestionPage.css";

export default function TERGestionPage(){
	const { id } = useParams<{ id: string }>();
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [selectedTER, setSelectedTER] = useState<TERPeriod | null>();
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [addingStudent, setAddingStudent] = useState<boolean>(false);
	const [addingTeacher, setAddingTeacher] = useState<boolean>(false);
	const [enrolledStudents, setEnrolledStudents] = useState<User[]>([]);
	const [enrolledTeachers, setEnrolledTeachers] = useState<User[]>([]);

	const getStudents = async () => {
		try {
			const data = await TERService.getEnrolledStudents(id);
			setEnrolledStudents(data);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const getTeachers = async () => {
		try {
			const data = await TERService.getEnrolledTeachers(id);
			setEnrolledTeachers(data);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const addStudentsHandle = async (selectedUsers: Set<string>) => {
		try {
			await Promise.all(
				Array.from(selectedUsers).map((stud_id) => {
					TERService.addEnroleStudent(id, stud_id);
				})
			);

			getStudents();
			setSuccess(`Ajout de ${selectedUsers.size} étudiant(s) avec succès.`);
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}

		setAddingStudent(false);
	};
	
	const studentView = () => {
		return <>
			<div className="dashboard-top-layout">
				<div>

				</div>

				<div className="dashboard-top-button-layout">
					<ImportCSVButton/>
					<Button icon={<FaPlus/>} label="Ajouter Etudiant" onClick={() => setAddingStudent(true)}/>
				</div>
			</div>
				
			<table className="users-table-style">
				<thead>
					<tr>
						<th>Profile</th>
						<th>Nom</th>
						<th>E-Mail</th>
						<th>Groupe</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{enrolledStudents && enrolledStudents.map((user, index) => (
						<tr key={index}>
							<td>
								<div className="users-table-avatar-container">
									<UserAvatar user={user}/>
								</div>
							</td>
							<td>{user.first_name} {user.last_name}</td>
							<td>{user.email}</td>
							<td>?</td>
							<td><IconButton icon={<MdDeleteOutline/>}/></td>
						</tr>
					))}
				</tbody>	
			</table>
		</>
	}

	const groupView = () => {
		return <>
			<div className="dashboard-top-layout">
				<div>

				</div>

				<div className="dashboard-top-button-layout">
					<Button icon={<FaPlus/>} label="Créer Groupe" onClick={() => setAddingStudent(true)}/>
				</div>
			</div>
		</>
	}
	
	const teacherView = () => {
		return <>
			<div className="dashboard-top-layout">
				<div>

				</div>

				<div className="dashboard-top-button-layout">
					<ImportCSVButton/>
					<Button icon={<FaPlus/>} label="Ajouter Enseignant" onClick={() => setAddingTeacher(true)}/>
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
	}

	const projectView = () => {
		return <>
			
		</>
	}

	useEffect(() => {
		const getPeriod = async () => {
			try {
				const data = await TERService.getPeriod(id);
				setSelectedTER(data);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		getPeriod();
		getStudents();
		getTeachers();
	}, []);

	const viewMap: Map<number, ReactNode> = new Map([
		[0, studentView()],
		[1, teacherView()],
		[2, groupView()],
		[3, projectView()],
		[4, studentView()],
	])

	return (
		<DashboardPage>
			{addingStudent && 
				<UserSelectionDialog 
					label="Ajout etudiants au TER"
					role_filter={[UserRoles.ETUDIANT]} 
					onClose={() => setAddingStudent(false)} 
					onConfirm={(users) => addStudentsHandle(users)}
				/>
			}

			{addingTeacher &&
				<UserSelectionDialog 
					label="Ajout encadrants au TER"
					role_filter={[UserRoles.ENCADRANT, UserRoles.EXTERNE, UserRoles.RESPO_TER, UserRoles.RESPO_STAGE, UserRoles.ADMIN]} 
					onClose={() => setAddingTeacher(false)} 
				/>
			}

			<div className="dashboard-top-layout">
				<div className="ter-admin-selected-ter-title">
					<label style={{fontWeight: 800, fontSize: "25px"}}>{selectedTER?.name}</label>
					<TagWidget label={TERStatusLabel.get(selectedTER?.status)}/>
				</div>
				<div></div>
			</div>

			<label style={{color: "var(--gray1-col)"}}>Vue d'ensemble des groupes, projets et participants.</label>

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Étudiants" active={currentPage == 0} icon={<FiUser/>} info={enrolledStudents.length} color={`var(--blue-col)`} onClick={() => setCurrentPage(0)}/>
				<InfoWidget label="Enseignants" active={currentPage == 1} icon={<TbSchool/>} info={0} color="var(--purple-col)" onClick={() => setCurrentPage(1)}/>
				<InfoWidget label="Groupes" active={currentPage == 2} icon={<FiUsers/>} info={0} color="var(--blue-col)" onClick={() => setCurrentPage(2)}/>
				<InfoWidget label="Sujets" active={currentPage == 3} icon={<FaRegFile/>} info={0} color="var(--orange-col)" onClick={() => setCurrentPage(3)}/>
				<InfoWidget label="Notations" active={currentPage == 4} icon={<TbSchool/>} info={0} color="var(--orange-col)" onClick={() => setCurrentPage(4)}/>
			</div>

			{success && <InfoBox label={success} type="success"/>}
			{error && <InfoBox label={error} type="error"/>}
	
			{viewMap.get(currentPage)}
		</DashboardPage>
	)
}