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

export interface TER {
	titre: string;
	code: string;
	year: number;
	groups: Group[];
	projects: Project[];
	statut: string;
	start_date: string;
	end_date: string;
};

export default class TERService {

}