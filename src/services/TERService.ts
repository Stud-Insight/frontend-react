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

export enum TERStatus {
	EN_COURS,
	ARCHIVED
};

export interface TERNotation {
	titre: string;
	max_notation: number;
	coef: number;
};

export interface GroupObjective {
	title: string;
	done: boolean;
};

export interface TERGroup {
	id: string;
	leader?: User;
	titre: string;
	members: User[];
	objectives?: GroupObjective[];
  	project?: Project;
	correcteur?: User;	
};

export interface TERPayload {
	id: number;
	title: string;
	code: string;
	year: number;
	status: string;
	start_date: string;
	end_date: string;
	max_groups: number;
}

export interface TER {
	title: string;
	code: string;
	year: number;
	groups: TERGroup[];
	projects: Project[];
	notation: TERNotation[];
	max_allowed_groups: number;
	status: string;
	startDate: string;
	endDate: string;
};

/* ---------------- USERS ---------------- */
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

/* ---------------- TER GROUPS ---------------- */
const group1: TERGroup = {
	id: "g1",
	titre: "Groupe Alpha",
	leader: alice,
	members: [alice, bob],
	project: projectA,
	objectives: [
		{ title: "Cahier des charges", done: true },
		{ title: "Prototype", done: false },
	],
	correcteur: encadrant,
};

const group2: TERGroup = {
	id: "g2",
	titre: "Groupe Beta",
	leader: charlie,
	members: [charlie, bob],
	project: projectB,
	objectives: [
		{ title: "Maquettes UX", done: true },
		{ title: "Démo fonctionnelle", done: true },
	],
	correcteur: encadrant,
};

const group3: TERGroup = {
	id: "g3",
	titre: "Groupe Gamma",
	leader: alice,
	members: [alice, charlie],
	project: projectC,
	objectives: [
		{ title: "Maquettes UX", done: true },
		{ title: "Démo fonctionnelle", done: true },
	],
	correcteur: encadrant,
};

/* ---------------- TER NOTATION ---------------- */
const notation: TERNotation[] = [
	{ titre: "Rapport", max_notation: 20, coef: 2 },
	{ titre: "Soutenance", max_notation: 20, coef: 3 },
	{ titre: "Travail en groupe", max_notation: 20, coef: 1 },
];

/* ---------------- TER ---------------- */
const mockTER: TER = {
	title: "TER Informatique 2026",
	code: "TER-2026",
	year: 2026,
	status: TERStatus.EN_COURS,
	startDate: "2026-09-01",
	endDate: "2027-01-31",
	max_allowed_groups: 10,
	groups: [group1, group2, group3],
	projects: [projectA, projectB, projectC],
	notation,
};


export default class TERService {
	public static async getAllTER(): Promise<TER[]> {
		try {
			const response = await api.get<TER[]>("/ter/");
			return response.data;
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