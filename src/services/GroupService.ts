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

export interface Group {
	id: string;
	students: User[];
};

export default class GroupService {
	public static async createGroup(titre: string){

	}

	public static async deleteGroup(group_id: string){

	}

	public static async addUserToGroup(group_id: string, user_id: string){

	}

	public static async removeUserFromGroup(group_id: string, user_id: string){
		
	}

	public static async getGroup(group_id: string){

	}
}