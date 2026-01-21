import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage.tsx";
import ProjetService, { Project } from "../../services/ProjectService.ts";
import InfoBox from "../../components/ui/InfoBox.tsx";
import ModalDialog from "../../components/input/ModalDialog.tsx";
import SubmitButton from "../../components/input/SubmitButton.tsx"
import InputDropdown from "../../components/input/InputDropdown.tsx";
import InputField from "../../components/input/InputField.tsx";
import ProjectWidget from "../../components/ui/ProjectWidget.tsx";
import ProjectService from "../../services/ProjectService.ts";
import ConfirmationDialog from "../../components/input/ConfirmationDialog.tsx";

import "./ProjectPage.css"

export default function ProjetPage(){
	const [titre, setTitre] = useState("");
	const [desc, setDesc] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [deleteProject, setDeleteProject] = useState<string | null>(null);
	const [createProject, setCreateProject] = useState(false);
	const [projetList, setProjetList] = useState<Project[]>([]);

	useEffect(() => {
		const fetchUserProjet = async () => {
			try {
				const data = await ProjectService.getUserProjects();
				setProjetList(data);
			} catch (err){
				setError(err instanceof Error ? err.message : "Erreur");
			}
		}

		fetchUserProjet();
	}, []);

	const project_delete_handler = () => {
		try {
			//TODO: CALL API
			console.log(deleteProject);
			setDeleteProject(null);
			setError("Erreur");
		} catch (err){
			setError(err instanceof Error ? err.message : "Erreur");
		}
	}

	const project_edit_handler = (project_id: string) => {
		
	}

	const project_create_handler = async () => {
		try {
			//TODO: CALL API
			setTitre("");
			setDesc("");
			setCreateProject(false);
			setError("Erreur");
		} catch (err){
			setError(err instanceof Error ? err.message : "Erreur");
		}
	}

	return (
		<DashboardPage>
			<label>Projets ({projetList.length})</label>
			{error && <InfoBox label={error} type="error"/>}

			<div className="project-list-layout">
				{projetList.map((pro, index) => (
					<ProjectWidget key={index} project={pro} onDelete={() => setDeleteProject(pro.id)} onEdit={() => project_edit_handler(pro.id)}/>
				))}
			</div>

			<SubmitButton label="Créer un projet" onChange={() => setCreateProject(true)}/>

			{createProject &&
				<ModalDialog label="Projet" onClose={() => setCreateProject(false)}>
					<InputField label={"Titre"} value={titre} onChange={setTitre}/>
					<InputField label={"Description"} value={desc} onChange={setDesc}/>
					<SubmitButton label="Créer Utilisateur" onChange={project_create_handler}/>
				</ModalDialog>
			}

			{deleteProject &&
				<ConfirmationDialog 
				label="Supprimer ce projet ?"
				info={`Ce projet sera surpprimé de la base de donnée. Cette action est irréversible et entraînera la perte de toutes les données associées.`}
				onCancel={() => setDeleteProject(null)}
				onConfirm={project_delete_handler}
				/>
			}
		</DashboardPage>
	);
}