import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage";
import SubmitButton from "../../atoms/input/Button";
import InfoWidget from "../../components/ui/InfoWidget";
import ProjectService, { Project, ProjectStatus } from "../../services/ProjectService";
import InfoBox from "../../components/ui/InfoBox";
import ProjectWidget from "../../components/objects/ProjectWidget";
import ConfirmationDialog from "../../components/dialog/ConfirmationDialog";
import InputField from "../../components/input/InputField";
import ModalDialog from "../../components/dialog/ModalDialog";
import InputTagSelection from "../../components/input/InputTagSelection";
import InputArea from "../../components/input/InputArea";
import InputNumberField from "../../components/input/InputNumberField";
import InputAttachement from "../../components/input/InputAttachement";

import { FaPlus } from "react-icons/fa6";
import { FaRegClock, FaRegCheckCircle, FaRegFile } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

import "./ProjectPage.css"
import "./DashboardPage.css"
import Button from "../../atoms/input/Button";

export default function ProjectPage(){
	const { user } = useAuth();
	const [error, setError] = useState<string | null>();
	const [projects, setProjects] = useState<Project[]>([]);
	const [deleteProject, setDeleteProject] = useState<Project | null>();
	const [createProject, setCreateProject] = useState<boolean>(false);
	const [title, setTitle] = useState("");
	const [etuMin, setEtuMin] = useState<number>(0);
	const [etuMax, setEtuMax] = useState<number>(0);
	const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set([]));

	const draftCount = projects.filter(
		p => p.status === ProjectStatus.DRAFT
	).length;

	const submitCount = projects.filter(
		p => p.status === ProjectStatus.SUBMITTED
	).length;

	const approveCount = projects.filter(
		p => p.status === ProjectStatus.APPROVED
	).length;

	useEffect(() => {
		const getProjects = async () => {
			try {
				const data = await ProjectService.getUserProjects(user.id);
				setProjects(data);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		};

		getProjects();
	}, []);

	const deleteHandle = async (proj: Project) => {
		try {

		} catch(err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	const editHandle = (proj: Project) => {

	};

	const cancelCreationHandle = () => {
		setCreateProject(false);
		setTitle("");
	};

	const confirmCreationHandle = () => {
		
		cancelCreationHandle();
	};

	const tagAddHandle = (tag: string) => {
		setSelectedTags(prev => {
			const newSet = new Set(prev);
			newSet.add(tag);
			return newSet;
		});
	}

	const tagDeleteHandle = (tag: string) => {
		setSelectedTags(prev => {
			const newSet = new Set(prev);
			newSet.delete(tag);
			return newSet;
		});
	}

	const tagOptions: string[] = ["JavaScript", "C", "C++", "C#", "Python", "lua"];
	
	return (
		<DashboardPage>
			{createProject &&
				<ModalDialog label="Créer Un Nouveau Projet" onClose={cancelCreationHandle} width={500}>
					<InputField label="Titre *"/>
					<InputArea label="Description *"/>
					<InputTagSelection label="Tags" tags={selectedTags} options={tagOptions} onSelect={(t: string) => tagAddHandle(t)} onDelete={(t: string) => tagDeleteHandle(t)}/>

					<div className="project-page-number-layout">
						<InputNumberField value={etuMin} label="Etudiants Minimum *" onChange={setEtuMin} min={0} max={5}/>
						<InputNumberField value={etuMax} label="Etudiants Maximum *" onChange={setEtuMax} min={0} max={5} defaultNum={5}/>
					</div>

					<Button label="Créer Projet" icon={<FaPlus/>} onChange={confirmCreationHandle}/>
				</ModalDialog>
			}

			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Mes Projets</label>
				</div>
			
				<div className="dashboard-top-button-layout">
					<div style={{width: "auto"}}>
						<SubmitButton icon={<FaPlus/>} label="Créer Un Projet" onChange={() => setCreateProject(true)}/>
					</div>
				</div>
			</div>
			<label style={{color: "var(--gray1-col)"}}>Créez et gérez vos propositions de projets TER.</label>

			{error && <InfoBox label={error} type="error"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Projets Créés" icon={<FaRegFile/>} info={projects.length.toString()} color="var(--blue-col)"/>
				<InfoWidget label="Projets Brouillon" icon={<FaRegClock/>} info={draftCount.toString()} color="var(--gray1-col)"/>
				<InfoWidget label="Projets Soumis" icon={<FaRegCheckCircle/>} info={submitCount.toString()} color="var(--gray1-col)"/>
				<InfoWidget label="Projets Approuvés" icon={<FaRegCheckCircle/>} info={approveCount.toString()} color="var(--green-col)"/>
			</div>

			{projects.map((proj, index) => (
				<ProjectWidget key={index} project={proj} onDelete={() => setDeleteProject(proj)} onEdit={() => editHandle(proj)}/>
			))}

			{deleteProject &&
				<ConfirmationDialog 
					label="Supprimer ce projet?" 
					info="Ce projet sera surpprimé définitivement de la base de donnée. Cette action est irréversible et entraînera la perte de toutes les données associées."
					onCancel={() => setDeleteProject(null)} 
					onConfirm={deleteHandle}
				/>
			}

		</DashboardPage>
	)
}