import { AxiosError } from "axios";
import AuthService from "./AuthService"
import api, { errorFormat, ApiError } from "../api/ApiHandle";

export enum UserRoles {
	ETUDIANT = "Étudiant",
	RESPO_TER = "Respo TER",
	RESPO_STAGE = "Respo Stage",
	ENCADRANT = "Encadrant",
	EXTERNE = "Externe",
	ADMIN = "Admin",
}

export const UserRolesLabels: Map<UserRoles, string> = new Map([
	[UserRoles.ETUDIANT, "Étudiant"],
	[UserRoles.RESPO_TER, "Responsable TER"],
	[UserRoles.RESPO_STAGE, "Responsable Stage"],
	[UserRoles.ENCADRANT, "Professeur"],
	[UserRoles.EXTERNE, "Externe"],
	[UserRoles.ADMIN, "Administrateur"],
]);

export const UserRolesColors = new Map<UserRoles, string>([
	[UserRoles.ETUDIANT, "var(--blue-col)"],
	[UserRoles.RESPO_TER, "var(--purple-col)"],
	[UserRoles.RESPO_STAGE, "var(--purple-col)"],
	[UserRoles.ENCADRANT, "var(--purple-col)"],
	[UserRoles.EXTERNE, "var(--orange-col)"],
	[UserRoles.ADMIN, "var(--red-col)"],
]);

export interface Group {
    name: UserRoles;
    permissions: string[];
};

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    groups: Group[];
    is_staff: boolean;
    is_superuser: boolean;
	date_joined?: string;
    last_login?: string | null;
};

export interface CreateUserPayload {
    email: string;
    first_name: string;
    last_name: string;
    groups?: string[];
};

export interface UpdateUserPayload {
	first_name: string;
	last_name: string;
	is_active: boolean;
	company_name: string | null;
	groups: string[];
};

export default class UserService {
	public static async importUserCSV(file: File): Promise<void> {
		try {
			const formData = new FormData();

			formData.append("file", file);

			await api.post("/users/import-csv", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getAllUsers(): Promise<User[] | null> {
		try {
			const response = await api.get<{results: User[]}>("/users/");
        	return response.data.results;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async updateUser(id: string, first_name: string, last_name: string, email: string, roles: Set<string>): Promise<void> {
		try {
			const load: UpdateUserPayload = {
				first_name: first_name,
				last_name: last_name,
				is_active: true,
				company_name: null,
				groups: Array.from(roles),
			};
			
			await api.put(`/users/${id}`, load);
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async deleteUser(id: string | undefined): Promise<void> {
		try {
			await AuthService.getCSRFToken();
			await api.delete(`/users/${id}`);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async createUser(nom: string, prenom: string, email: string, roles: Set<string>): Promise<User | null> {
		try {
			await AuthService.getCSRFToken();

			const p: CreateUserPayload = {
				email: email,
				first_name: prenom,
				last_name: nom,
				groups: Array.from(roles),
        	};

			const response = await api.post<User>("/users/create", p);
			return response.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static isProfessor(user: User): boolean {
		return user.groups.some(role => {
			return role.name == UserRoles.ENCADRANT;
		});
	}

	public static isStudent(user: User): boolean {
		return user.groups.some(role => {
			return role.name == UserRoles.ETUDIANT;
		});
	}

	public static isRespo(user: User): boolean {
		return user.groups.some(role => {
			return (role.name == UserRoles.RESPO_STAGE) || (role.name == UserRoles.RESPO_TER);
		});
	}
	
	public static isAdmin(user: User): boolean {
		return user.groups.some(role => {
			return role.name == UserRoles.ADMIN;
		});
	}
};
