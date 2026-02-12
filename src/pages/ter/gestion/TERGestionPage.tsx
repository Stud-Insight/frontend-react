import React, {useState, useEffect, ReactNode}from "react";
import DashboardPage from "../../dashboard/DashboardPage";
import InfoWidget from "../../../components/ui/InfoWidget";
import Button from "../../../atoms/input/Button";
import InfoBox from "../../../components/ui/InfoBox";
import UserSelectionDialog from "../../../components/dialog/UserSelectionDialog";
import TagWidget from "../../../atoms/ui/Tag";
import ImportCSVButton from "../../../components/button/ImportCSVButton";
import TERService, { TERPeriod, TERStatusLabel  } from "../../../services/TERService";
import { Group } from "../../../services/GroupService";
import GroupService from "../../../services/GroupService";
import ModalDialog from "../../../components/dialog/ModalDialog";
import InputField from "../../../components/input/InputField";
import InputNumberField from "../../../components/input/InputNumberField";
import GroupProjectWidget from "../../../components/objects/GroupProjectWidget"

import { TbSchool } from "react-icons/tb";
import { FaRegFile } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { User, UserRoles } from "../../../services/UserService";
import { useParams } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";

import TERStudentView from "./TERStudentsView";
import TERGroupView from "./TERGroupView";
import TERProfessorView from "./TERProfessorView";

import "./TERGestionPage.css";

export default function TERGestionPage(){
	const { id } = useParams<{ id: string }>();
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [period, setPeriod] = useState<TERPeriod | null>();
	const [view, setView] = useState<number>(0);
	const [students, setStudents] = useState<User[]>([]);
	const [groups, setGroup] = useState<Group[]>([]);
	const [professors, setProfessors] = useState<User[]>([]);

	const getStudents = async () => {
		try {
			const data = await TERService.getStudents(id);
			setStudents(data);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const getProfessors = async () => {
		try {
			const data = await TERService.getProfessors(id);
			setProfessors(data);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const getGroups = async () => {
		try {
			const data = await GroupService.getAllTERGroups(id);
			setGroup(data);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const createGroupHandle = async () => {
		try {
			await GroupService.createGroup(id, groupNom, groupeTaille);
			setSuccess(`Groupe "${groupNom} à été crée avec success."`);
			getGroups();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}

		setGroupNom("");
		setGroupTaille(2);
		setAddingGroup(false);
	};

	const addStudentHandle = async (selectedUsers: Set<string>) => {
		try {
			await Promise.all(
				Array.from(selectedUsers).map((stud_id) => 
					TERService.addStudent(id, stud_id)
				)
			);
			setSuccess(`Ajout de ${selectedUsers.size} étudiant(s) avec succès.`);
			getStudents();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};
	
	const deleteStudentHandle = async () => {
		try {
			await Promise.all(
				Array.from(selectedUsers).map((stud_id) => 
					TERService.addStudent(id, stud_id)
				)
			);
			setSuccess(`Ajout de ${selectedUsers.size} étudiant(s) avec succès.`);
			getStudents();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	useEffect(() => {
		const getPeriod = async () => {
			try {
				const data = await TERService.getPeriod(id);
				setPeriod(data);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		getPeriod();
		getStudents();
		getProfessors();
		getGroups();
	}, []);

	const viewMap: Map<number, ReactNode> = new Map([
		[0, <TERStudentView students={students}/>],
		[1, <TERProfessorView professors={professors}/>],
		[2, <TERGroupView groups={groups}/>],
		[3, <TERStudentView students={students}/>],
		[4, <TERStudentView students={students}/>],
	])

	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="ter-admin-selected-ter-title">
					<label style={{fontWeight: 800, fontSize: "25px"}}>{period?.name}</label>
					<TagWidget label={TERStatusLabel.get(period?.status)}/>
				</div>
				<div></div>
			</div>

			<label style={{color: "var(--gray1-col)"}}>Vue d'ensemble des groupes, projets et participants.</label>

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Étudiants" active={view == 0} icon={<FiUser/>} info={students.length} color={`var(--blue-col)`} onClick={() => setView(0)}/>
				<InfoWidget label="Enseignants" active={view == 1} icon={<TbSchool/>} info={0} color="var(--purple-col)" onClick={() => setView(1)}/>
				<InfoWidget label="Groupes" active={view == 2} icon={<FiUsers/>} info={groups.length} color="var(--blue-col)" onClick={() => setView(2)}/>
				<InfoWidget label="Sujets" active={view == 3} icon={<FaRegFile/>} info={0} color="var(--orange-col)" onClick={() => setView(3)}/>
				<InfoWidget label="Notations" active={view == 4} icon={<TbSchool/>} info={0} color="var(--orange-col)" onClick={() => setView(4)}/>
			</div>

			{success && <InfoBox label={success} type="success"/>}
			{error && <InfoBox label={error} type="error"/>}
	
			{viewMap.get(view)}
		</DashboardPage>
	)
}