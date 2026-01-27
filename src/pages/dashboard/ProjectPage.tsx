import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage";
import SubmitButton from "../../components/input/SubmitButton";
import InfoWidget from "../../components/ui/InfoWidget";
import ProjectService, { Project, ProjectStatus } from "../../services/ProjectService";
import HorizontalDivider from "../../components/ui/HorizontalDivider";
import InfoBox from "../../components/ui/InfoBox";
import ProjectWidget from "../../components/objects/ProjectWidget";
import { MdAdd } from "react-icons/md";
import ConfirmationDialog from "../../components/input/ConfirmationDialog";
import { FaPlus } from "react-icons/fa6";
import { FaRegClock, FaRegCheckCircle, FaRegFile } from "react-icons/fa";

import "./ProjectPage.css"
import "./DashboardPage.css"

export default function ProjectPage(){
	const [error, setError] = useState<string | null>();
	const [projects, setProjects] = useState<Project[]>([]);
	const [deleteProject, setDeleteProject] = useState<Project | null>();

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
				const data = await ProjectService.getUserProjects();
				setProjects(data);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		};

		getProjects();
	}, []);

	const delete_handle = async (proj: Project) => {
		try {

		} catch(err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const edit_handle = (proj: Project) => {

	}
	
	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Mes Projets</label>
				</div>
			
				<div className="dashboard-top-button-layout">
					<div style={{width: "auto"}}>
						<SubmitButton icon={<FaPlus/>} label="Créer Un Projet"/>
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
				<ProjectWidget key={index} project={proj} onDelete={() => setDeleteProject(proj)} onEdit={() => edit_handle()}/>
			))}

			{deleteProject &&
				<ConfirmationDialog 
					label="Supprimer ce projet?" 
					info="Ce projet sera surpprimé définitivement de la base de donnée. Cette action est irréversible et entraînera la perte de toutes les données associées."
					onCancel={() => setDeleteProject(null)} 
					onConfirm={delete_handle}
				/>
			}

		</DashboardPage>
	)
}