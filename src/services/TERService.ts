import axios, { AxiosError } from "axios";
import { User } from "./UserService"
import { Project } from "./ProjectService";
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
	statut: string;
	startDate: string;
	endDate: string;
};

export default class TERService {

}