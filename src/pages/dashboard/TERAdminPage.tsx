import React from "react";
import DashboardPage from "./DashboardPage";
import InfoWidget from "../../components/ui/InfoWidget";
import ContainerWidget from "../../components/ui/ContainerWidget";
import GroupProjectWidget from "../../components/objects/GroupProjectWidget";

import { FaRegClock, FaRegCheckCircle, FaRegFile } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { GroupProject, GroupObjective } from "../../services/TERService";
import { Group } from "../../services/GroupService";
import { User } from "../../services/UserService";

import { ProjectStatus, Project } from "../../services/ProjectService";

import "./DashboardPage.css"
import "./TERAdminPage.css"

export default function TERAdminPage(){
	const mock_project: Project = {
		id: "1",
		ter_id: "TER-2025",
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
		status: ProjectStatus.DRAFT,
		created_date: "Septembre 10, 2025",
		language: ["JavaScript", "TypeScript", "React", "Node.js"],
		min_person: 2,
		max_person: 4	
	};

	const mock_user: User = {
		id: "3",
		email: "vincent@gmail.com",
		first_name: "Vincent",
		last_name: "Hannah",
		groups: [],
		is_staff: false,
		is_superuser: false,
	};

	const mock_leader: User = {
		id: "3",
		email: "lukas@gmail.com",
		first_name: "Lukas",
		last_name: "Bobbi",
		groups: [],
		is_staff: false,
		is_superuser: false,
	};

	const group_mock: Group = {
		id: "2",
		students: [
			mock_leader,
			mock_user,
			mock_user,
			mock_user,
		]
	}
	const groupproject_mock: GroupProject = {
		id: "G0",
		group_leader: mock_leader,
		titre: "Groupe A",
		group: group_mock,
		objectives: [],
		project: mock_project
	};

	return (
		<DashboardPage>
			<label style={{fontWeight: 800, fontSize: "25px"}}>Gestion TER</label>
			<label>Choose a TER to view detailed information about groups, projects, and professors.</label>

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Groupes" icon={<FiUsers/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Projets" icon={<FaRegFile/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Encadrants" icon={<FiUser/>} info={0} color="var(--purple-col)"/>
				<InfoWidget label="Avançement Moyen" icon={<FaArrowTrendUp/>} info={`${0 * 100}%`} color="var(--orange-col)"/>
			</div>

			<ContainerWidget icon={<FiUsers/>} label="Groupes">
				<GroupProjectWidget group={groupproject_mock}/>
			</ContainerWidget>

			<ContainerWidget icon={<FiUser/>} label="Encadrants">
				
			</ContainerWidget>
		</DashboardPage>
	)
}