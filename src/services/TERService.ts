import axios, { AxiosError } from "axios";
import { User } from "./UserService"
import { Project, ProjectStatus } from "./ProjectService";
import { Group } from "./GroupService";

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

export interface GroupObjective {
	title: string;
	done: boolean;
};

export interface GroupProject {
	id: string;
	group_leader: User;
	titre: string;
	group: Group;
	objectives: GroupObjective[];
  	project?: Project;
	correcteur?: User;	
};

export interface Notation {
	titre: string;
	max_notation: number;
	coef: number;
};

export interface TER {
	title: string;
	code: string;
	year: number;
	groups: GroupProject[];
	status: string;
	startDate: string;
	endDate: string;
};

export default class TERService {
	public static async getTER(): Promise<TER>{
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

			const mock_ter: TER = {
				title: "Projet Programmation 2026",
				code: "TER-2026",
				year: 2026,
				groups: [
					groupproject_mock
				],
				status: "ee",
				startDate: "",
				endDate: "",
			}

			return mock_ter;
		} catch (error){
			error_formatting(error as AxiosError<ApiError>);
		}
	}
}