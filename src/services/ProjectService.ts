import axios, { AxiosError } from "axios";
import { User } from "./UserService"

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Pour envoyer les cookies de session
    timeout: 10000,
});

const error_formatting = (error: AxiosError<ApiError>): never => {
	if (error.response) {
		throw new Error(error.message);
	} else {
		throw new Error("Erreur de connexion au serveur");
	}
};

export enum ProjectStatus {
	DRAFT,
	SUBMITTED,
	APPROVED,
	PUBLISHED,
	REJECTED
};

export interface Project {
	id: string;
	ter_id?: string;
	author?: User[];
	externes?: User[];  
	title: string;
	description: string;
	tasks?: string[];
	language?: string[];
	created_date?: string;
	status: ProjectStatus;
	min_person?: number;
	max_person?: number;
};

export default class ProjectService {
	public static async getUserProjects(): Promise<Project[]> {
		try {
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

			const mock: Project[] = [
				mock_project,
				mock_project
			];

			return mock
		} catch (error){
			error_formatting(error as AxiosError<ApiError>);
		}	
	}
}

