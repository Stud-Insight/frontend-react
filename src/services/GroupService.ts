import axios from "axios";
import { User } from "./UserService"
import { errorFormat, ApiError } from "../utils/ErrorHandler";

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    timeout: 10000,
});

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