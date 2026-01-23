import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage";
import SubmitButton from "../../components/input/SubmitButton";
import InfoWidget from "../../components/ui/InfoWidget";
import ProjectService, { Project } from "../../services/ProjectService";
import HorizontalDivider from "../../components/ui/HorizontalDivider";
import InfoBox from "../../components/ui/InfoBox";
import ProjectWidget from "../../components/objects/ProjectWidget";

import { FaRegClock, FaRegCheckCircle, FaRegFile } from "react-icons/fa";

import "./ProjectPage.css"
import "./DashboardPage.css"

export default function ProjectPage(){
	const [error, setError] = useState<string | null>();
	const [projects, setProjects] = useState<Project[]>([]);

	var draft_project: number = 0;
	var approved_project: number = 0;
	var submitted_project: number = 0;

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

		{projects.map((proj, index) => {
			if (proj.ter_id == null){
				draft_project += 1;
			}
		})}
	}, []);


	const delete_handle = () => {

	}
	
	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Mes Projets</label>
					<label>Create and manage your TER project proposals.</label>
				</div>
			
				<div className="dashboard-top-button-layout">
					<SubmitButton label="Créer un projet"/>
				</div>
			</div>

			{error && <InfoBox label={error} type="error"/>}

			<div className="project-page-info-layout">
				<InfoWidget label="Total Projects" icon={<FaRegFile/>} info={projects.length.toString()} color="var(--blue-col)"/>
				<InfoWidget label="Draft Projects" icon={<FaRegClock/>} info={draft_project.toString()} color="var(--gray1-col)"/>
				<InfoWidget label="Submitted" icon={<FaRegCheckCircle/>} info={submitted_project.toString()} color="var(--gray1-col)"/>
				<InfoWidget label="Approved" icon={<FaRegCheckCircle/>} info={approved_project.toString()} color="var(--green-col)"/>
			</div>

			{projects.map((proj, index) => (
				<ProjectWidget project={proj}/>
			))}

		</DashboardPage>
	)
}