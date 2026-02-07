import React, { useState, useEffect } from "react"
import DashboardPage from "../../dashboard/DashboardPage";
import ContainerWidget from "../../../components/ui/ContainerWidget";
import UserWidget from "../../../components/objects/UserWidget";
import ScheduleEventWidget from "../../../components/ui/ScheduleEventWidget";
import InfoBox from "../../../components/ui/InfoBox";
import ProjectWidget from "../../../components/objects/SubjectWidget";

import { FaRegClock, FaRegCheckCircle } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { HiOutlineMenu } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { User } from "../../../services/UserService";
import { Subject, SubjectStatus } from "../../../services/SubjectService";
import InfoWidget from "../../../components/ui/InfoWidget";

import "./TERInfoPage.css"
import "../../dashboard/DashboardPage.css"

export default function PeriodInfoPage(){
	const [error, setError] = useState<string | null>();
	const [project, setProject] = useState<Subject | null>();
	
	useEffect(() => {
		const getProject = async () => {
			try {
				const mock_project: Subject = {
					id: "1",
					ter_id: "Period-2025",
					author: [
						{
							id: "1",
							first_name: "Sébastien",
							last_name: "Da Silva",
							email: "sebastien.dasilva@lirmm.fr",
							groups: [],
							is_staff: true,
							is_superuser: true,
						}
					],
					title: "Développement d’une application pour l’évaluation des étudiants lors des expériences professionnelles.",
					description: `Dans le cadre de sa formation, un étudiant peut être amené à effectuer de nombreux
						stages d’immersion dans le monde professionnel. Ces expériences doivent faire l’objet
						d’une évaluation de la part de l’encadrant en entreprise, ce qui entraîne de nombreux
						échanges de courriels et de documents.
	
						Afin de faciliter cela et, surtout, d’automatiser les interactions, le développement
						d’une application web a été démarré l’année dernière et doit se poursuivre cette année.
	
						Cette application devra permettre de gérer la totalité des étudiants du département
						d’informatique, leurs encadrants industriels, voire académiques, ainsi que l’ensemble
						des organismes qui accueillent les stagiaires.
	
						La solution devra être facilement utilisable par des non-informaticiens et permettre
						l’importation et l’exportation de la totalité des données. De plus, une fonction de
						recherche sera mise en place sur l’ensemble des informations de l’application.
	
						Un ensemble de documents est disponible pour la prise en main du projet, dont des
						cahiers techniques et les rapports écrits l’année dernière.
					`,
					tasks: [
						"Analyse des besoins",
						"Conception de l’architecture",
						"Développement frontend",
						"Développement backend",
						"Tests et documentation",
					],
					status: SubjectStatus.DRAFT,
					created_date: "Septembre 10, 2025",
					language: ["JavaScript", "TypeScript", "React", "Node.js"],
					min_person: 2,
					max_person: 4	
				};

				setProject(mock_project);
			} catch(err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		};

		getProject();
	}, []);

	const jours: number = 103;

	return (
		<DashboardPage>
			<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Period Information</label>
			<label>Détaile et information sur votre Period, équipe et emploi du temps.</label>

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Avancement" icon={<FaArrowTrendUp/>} info={`${0.5 * 100}%`} color="var(--blue-col)"/>
				<InfoWidget label="Objectifs" icon={<FaRegCheckCircle/>} info={`${1} / ${4}`} color="var(--green-col)"/>
				<InfoWidget label="Deadline" icon={<FaRegClock/>} info={`${jours} Jours`} color="var(--orange-col)"/>
			</div>
			
			{error && <InfoBox label={error} type="error"/>}
			{project && <ProjectWidget project={project} privateMode={false}/> }

			<div className="ter-page-container-layout">
				<div className="ter-page-left-container">
					<ContainerWidget icon={<FiUser/>} label="Encadrant">
						<UserWidget user={mock_user}/>
					</ContainerWidget>

					<ContainerWidget icon={<FiUsers/>} label="Membres (4)">
						<UserWidget user={mock_user} role="Frontend"/>
						<UserWidget user={mock_user} role="Frontend"/>
						<UserWidget user={mock_user} role="Frontend"/>
						<UserWidget user={mock_user} role="Frontend"/>
						<UserWidget user={mock_user} role="Frontend"/>
						<UserWidget user={mock_user} role="Frontend"/>
					</ContainerWidget>
				</div>
				
				<ContainerWidget icon={<HiOutlineMenu/>} label="Objectifs">
					<ScheduleEventWidget label="Subject Proposal Submission" date="Oct 15, 2025" completed={true}/>
					<ScheduleEventWidget label="Subject Proposal Submission" date="Oct 15, 2025" completed={false}/>
				</ContainerWidget>
			</div>
		</DashboardPage>
	)
}