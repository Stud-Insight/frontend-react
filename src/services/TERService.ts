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
	projects: Project[];
	status: string;
	startDate: string;
	endDate: string;
};

const alice: User = {
	id: "u1",
	first_name: "Alice",
	last_name: "Martin",
	email: "alice.martin@gmail.com",
	groups: [],
	is_staff: false,
	is_superuser: false,
};

const bob: User = {
	id: "u2",
	first_name: "Bob",
	last_name: "Durand",
	email: "bob.durand@gmail.com",
	groups: [],
	is_staff: false,
	is_superuser: false,
};

const charlie: User = {
	id: "u3",
	first_name: "Charlie",
	last_name: "Dupont",
	email: "charlie.dupont@gmail.com",
	groups: [],
	is_staff: false,
	is_superuser: false,
};

const encadrant: User = {
	id: "u4",
	first_name: "Sébastien",
	last_name: "Da Silva",
	email: "sebastien.dasilva@lirmm.fr",
	groups: [],
	is_staff: true,
	is_superuser: false,
};

/* ---------------- PROJECTS ---------------- */
const projectA: Project = {
	id: "p1",
	ter_id: "TER-2026",
	author: [encadrant],
	title: "Plateforme d’évaluation des stages",
	description: "Application web pour gérer les évaluations de stages.",
	tasks: [
		"Analyse des besoins",
		"Développement frontend",
		"Développement backend",
	],
	status: ProjectStatus.PUBLISHED,
	created_date: "2026-09-01",
	language: ["React", "TypeScript", "Django"],
	min_person: 2,
	max_person: 4,
};

const projectB: Project = {
	id: "p2",
	ter_id: "TER-2026",
	author: [encadrant],
	title: "Application mobile de gestion de planning",
	description: "Outil mobile pour gérer les emplois du temps.",
	tasks: ["UX design", "Mobile dev", "Tests"],
	status: ProjectStatus.PUBLISHED,
	created_date: "2026-09-05",
	language: ["Flutter", "Firebase"],
	min_person: 2,
	max_person: 3,
};

const projectC: Project = {
	id: "p3",
	ter_id: "TER-2026",
	author: [encadrant],
	title: "Outil d’analyse de données pédagogiques",
	description: "Analyse statistique des performances étudiantes.",
	tasks: ["Data collection", "Data analysis", "Visualization"],
	status: ProjectStatus.DRAFT,
	created_date: "2026-09-10",
	language: ["Python", "Pandas", "Matplotlib"],
	min_person: 1,
	max_person: 2,
};

/* ---------------- GROUPS ---------------- */
const group1: Group = {
	id: "g1",
	students: [alice, bob],
};

const group2: Group = {
	id: "g2",
	students: [charlie, bob],
};

const group3: Group = {
	id: "g3",
	students: [alice, charlie],
};

/* ---------------- GROUP PROJECTS ---------------- */
const groupProject1: GroupProject = {
	id: "gp1",
	titre: "Groupe Alpha",
	group_leader: alice,
	group: group1,
	project: projectA,
	objectives: [
		{ title: "Cahier des charges", done: true },
		{ title: "Prototype", done: false },
	],
	correcteur: encadrant,
};

const groupProject2: GroupProject = {
	id: "gp2",
	titre: "Groupe Beta",
	group_leader: charlie,
	group: group2,
	project: projectB,
	objectives: [
		{ title: "Maquettes UX", done: true },
		{ title: "Démo fonctionnelle", done: true },
	],
	correcteur: encadrant,
};

const groupProject3: GroupProject = {
	id: "gp3",
	titre: "Groupe Gamma",
	group_leader: alice,
	group: group3,
	project: projectC,
	objectives: [
		{ title: "Maquettes UX", done: true },
		{ title: "Démo fonctionnelle", done: true },
	],
	correcteur: encadrant,
};

/* ---------------- TER ---------------- */
const mockTER: TER = {
	title: "TER Informatique 2026",
	code: "TER-2026",
	year: 2026,
	status: "EN_COURS",
	startDate: "2026-09-01",
	endDate: "2027-01-31",
	groups: [groupProject1, groupProject2, groupProject3],
	projects: [projectA, projectB, projectC],
};

export default class TERService {
	public static async getAllTER(): Promise<TER[]> {
		try {
			return [mockTER];
		} catch (error) {
			error_formatting(error as AxiosError<ApiError>);
		}
	}
	
	public static async getTER(): Promise<TER> {
		try {
			return mockTER;
		} catch (error) {
			error_formatting(error as AxiosError<ApiError>);
		}
	}
}