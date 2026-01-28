import axios, { AxiosError } from "axios";
import AuthService from "./AuthService"

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    timeout: 10000,
});

export enum UserRole {
	ETUDIANT = "Étudiant",
	RESPO_TER = "Respo TER",
	RESPO_STAGE = "Respo Stage",
	ENCADRANT = "Encadrant",
	EXTERNE = "Externe",
	ADMIN = "Admin",
}

export interface Group {
    name: string;
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

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
};

const error_formatting = (error: AxiosError<ApiError>): never => {
    if (error.response) {
        throw new Error(error.message);
    } else {
        throw new Error("Erreur de connexion au serveur");
    }
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
			error_formatting(error as AxiosError<ApiError>);
		}
	}

	public static async getAllUsers(): Promise<User[]> {
		try {
			const response = await api.get<User[]>("/users/");
        	return response.data;
		} catch (error){
			error_formatting(error as AxiosError<ApiError>);
		}	
	}

	public static async updateUser(id: string, first_name: string, last_name: string, email: string, roles: string[]): Promise<void> {
		try {
			const load: UpdateUserPayload = {
				first_name: first_name,
				last_name: last_name,
				is_active: true,
				company_name: null,
				groups: roles,
			};

			await api.put(`/users/${id}`, load);
		} catch (error){
			error_formatting(error as AxiosError<ApiError>);
		}
	}

	public static async deleteUser(id: string | undefined): Promise<void> {
		try {
			await AuthService.getCSRFToken();
			await api.delete(`/users/${id}`);
		} catch (error) {
			error_formatting(error as AxiosError<ApiError>);
		}
	}

	public static async createUser(roles: string[], nom: string, prenom: string, email: string): Promise<User> {
		try {
			await AuthService.getCSRFToken();

			const p: CreateUserPayload = {
				email: email,
				first_name: prenom,
				last_name: nom,
				groups: roles,
        	};

			const response = await api.post<User>("/users/create", p);
			return response.data;
		} catch (error) {
			error_formatting(error as AxiosError<ApiError>);
		}
	}
};
