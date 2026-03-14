import React, {useState, useEffect, ReactNode}from "react";
import DashboardPage from "../../dashboard/DashboardPage";
import InfoWidget from "../../../components/ui/InfoWidget";
import InfoBox from "../../../components/ui/InfoBox";
import Tag from "../../../atoms/ui/Tag";
import TERStudentView from "./TERStudentsView";
import TERGroupView from "./TERGroupView";
import TERProfessorView from "./TERProfessorView";
import TERGradeView from "./TERGradeView";
import TERSubjectView from "./TERSubjectView";

import TERService, { TERPeriod, TERStatusColor, TERStatusLabel } from "../../../services/TERService";
import GroupService, { Group } from "../../../services/GroupService";
import GradeService, { Grade } from "../../../services/GradeService";
import SubjectService, { Subject } from "../../../services/SubjectService";

import { GoGear } from "react-icons/go";
import { TbSchool } from "react-icons/tb";
import { FaPlus, FaRegFile } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiDownload } from 'react-icons/fi';
import { User, UserRoles } from "../../../services/UserService";
import { useParams } from "react-router-dom";
import Button from "../../../atoms/input/Button";


import "./TERGestionPage.css";

export default function TERGestionPage(){
	const { id } = useParams<{ id: string }>();
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [period, setPeriod] = useState<TERPeriod | null>();
	const [view, setView] = useState<number>(0);
	const [students, setStudents] = useState<User[]>([]);
	const [grades, setGrades] = useState<Grade[]>([]);
	const [groups, setGroup] = useState<Group[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [professors, setProfessors] = useState<User[]>([]);

	const addStudent = async (users: Set<string>) => {
		try {
			await Promise.all(
				Array.from(users).map((stud_id) => 
					TERService.addStudent(id, stud_id)
				)
			);
			setSuccess(`Ajout de ${users.size} étudiant(s) avec succès à "${period?.name}".`);
			getStudents();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	const deleteStudent = async (user: User) => {
		try {
			await TERService.deleteStudent(id, user.id);
			setSuccess(`Etudiant "${user.first_name} ${user.last_name}" supprimé de "${period?.name}".`);
			getStudents();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

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

	const deleteProfessor = async (prof: User) => {
		try {
			await TERService.deleteProfessor(id, prof.id);
			setSuccess(`Professeur "${prof.first_name} ${prof.last_name}" supprimé de "${period?.name}".`);
			getProfessors();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const addProfessors = async (users: Set<string>) => {
		try {
			await Promise.all(
				Array.from(users).map((prof_id) => 
					TERService.addProfessor(id, prof_id)
				)
			);

			setSuccess(`Ajout de ${users.size} professeur(s) dans "${period?.name}"`);
			getProfessors();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const getGroups = async () => {
		try {
			const data = await GroupService.getGroups(id);
			setGroup(data);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const updateGroup = async (group: Group, name: string, size: number) => {
		try {
			await GroupService.updateGroup(group.id, name, size);
			setSuccess(`Groupe "${group.name}" à été modifié avec succés.`);
			getGroups();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	const removeStudentGroup = async (group: Group, user: User) => {
		try {
			await GroupService.removeMember(group.id, user.id);
			setSuccess(`Etudiant "${user.first_name} ${user.last_name}" supprimé du groupe "${group.name}".`);
			getGroups();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	const addStudentGroup = async (group: Group, users: Set<User>) => {
		try {
			await Promise.all(
				Array.from(users).map(user => (
					GroupService.addMember(group.id, user.id)
				))
			);

			setSuccess(`${users.size} Etudiant(s) ajouté au groupe "${group.name}".`);
			getGroups();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	const createGroup = async (nom: string, taille: number) => {
		try {
			await GroupService.createGroup(id, nom, taille, new Set());
			setSuccess(`Groupe "${nom}" à été crée dans "${period?.name}"`);
			getGroups();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	const changeGroupLeader = async (group: Group, user: User) => {
		try {
			await GroupService.changeGroupLeader(group.id, user.id);
			setSuccess(`"${user.first_name} ${user.last_name}" est maintenant le leader du groupe "${group.name}".`);
			getGroups();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const deleteGroup = async (group: Group) => {
		try {
			await GroupService.deleteGroup(group.id);
			getGroups();
			setSuccess(`Groupe "${group.name}" à été supprimé de "${period?.name}".`);
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const getGrades = async () => {
		try {
			const res = await GradeService.getGrades(id);
			setGrades(res);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const getSubjects = async () => {
		try {
			const data = await TERService.getSubjects(id);
			setSubjects(data);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const acceptSubject = async (subject: Subject) => {
		try {
			await SubjectService.acceptSubject(subject.id);
			getSubjects();
			setSuccess(`Sujet "${subject.title}" à été accepté avec succés.`);
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const rejectSubject = async (subject: Subject) => {
		try {
			await SubjectService.rejectSubject(subject.id);
			getSubjects();
			setSuccess(`Sujet "${subject.title}" à été rejeté avec succés.`);
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}
	
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
		getGrades();
		getSubjects();
	}, []);

	const viewMap: Map<number, ReactNode> = new Map([
		[0, <TERStudentView students={students} onAdd={addStudent} onDelete={deleteStudent}/>],
		[1, <TERProfessorView professors={professors} onAdd={addProfessors} onDelete={deleteProfessor}/>],
		[2, <TERGroupView groups={groups} students={students} 
			onAdd={createGroup} 
			onDelete={deleteGroup}
			onUpdate={updateGroup}
			onAddUsers={addStudentGroup}
			onUserDelete={removeStudentGroup}
			onChangeLeader={changeGroupLeader}
			/>],
		[3, <TERSubjectView subjects={subjects} onAccept={acceptSubject} onReject={rejectSubject}/>],
		[4, <TERGradeView grades={grades}/>],
	])

	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="ter-admin-selected-ter-title">
					<span style={{fontWeight: 800, fontSize: "25px"}}>{period?.name}</span>
					<Tag label={TERStatusLabel.get(period?.status)} color={TERStatusColor.get(period?.status)}/>
				</div>

				<div className="dashboard-top-button-layout">
					<Button icon={<FiDownload/>} label="Exporter CSV"/>
				</div>
			</div>

			<span style={{color: "var(--gray1-col)"}}>Vue d'ensemble des groupes, sujets, notations et participants du TER.</span>

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Étudiants" active={view == 0} icon={<FiUser/>} info={students.length} color={`var(--blue-col)`} onClick={() => setView(0)}/>
				<InfoWidget label="Professeurs" active={view == 1} icon={<TbSchool/>} info={professors.length} color="var(--purple-col)" onClick={() => setView(1)}/>
				<InfoWidget label="Groupes" active={view == 2} icon={<FiUsers/>} info={groups.length} color="var(--blue-col)" onClick={() => setView(2)}/>
			</div>

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Sujets" active={view == 3} icon={<FaRegFile/>} info={subjects.length} color="var(--orange-col)" onClick={() => setView(3)}/>
				<InfoWidget label="Notations" active={view == 4} icon={<TbSchool/>} info={grades.length} color="var(--orange-col)" onClick={() => setView(4)}/>
				<InfoWidget label="Paramêtres" active={view == 5} icon={< GoGear/>} color="var(--gray1-col)" onClick={() => setView(5)}/>
			</div>

			{success && <InfoBox label={success} type="success"/>}
			{error && <InfoBox label={error} type="error"/>}
	
			{viewMap.get(view)}
		</DashboardPage>
	)
}