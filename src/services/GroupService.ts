import { AxiosError } from "axios";
import { User } from "./UserService"
import api, { errorFormat, ApiError } from "../api/ApiHandle";

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