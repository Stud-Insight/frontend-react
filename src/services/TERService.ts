import axios, { AxiosError } from "axios";
import { User } from "./UserService"
import { Project, ProjectStatus } from "./ProjectService";
import { Group } from "./GroupService";

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
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

export interface TERSubject {
	id: string;
	title: string;
	description: string;
	domain: string;
	status: "draft" | "submitted" | "validated" | "rejected";
	max_groups: number;
	ter_period_id: string;
	professor?: User;
	supervisor?: User;
	is_favorite?: boolean;
}

export interface TERPeriodCreatePayload {
	name: string;
	academic_year: string;
	group_formation_start: string;
	group_formation_end: string;
	subject_selection_start: string;
	subject_selection_end: string;
	assignment_date: string;
	project_start: string;
	project_end: string;
	min_group_size?: number;
	max_group_size?: number;
}

export interface TERPeriod {
	id: string;
	name: string;
	academic_year: string;
	status: "draft" | "open" | "closed" | "archived";
	group_formation_start: string;
	group_formation_end: string;
	subject_selection_start?: string;
	subject_selection_end?: string;
	assignment_date?: string;
	project_start?: string;
	project_end?: string;
	min_group_size: number;
	max_group_size: number;
}

export interface TERPeriodStats {
	subjects: number;
	projects: number;
	groups: number;
	students: number;
}

export default class TERService {
	public static async getAllPeriods(): Promise<TERPeriod[]> {
		try {
			const res = await api.get<TERPeriod[]>("/ter/periods/");
			return res.data;
		} catch (error){
			error_formatting(error as AxiosError<ApiError>);
		}
	}

	public static async getPeriodStats(id: string): Promise<TERPeriodStats> {
		try {
			const res = await api.get<TERPeriodStats>(`/ter/periods/${id}/stats`);
			return res.data;
		} catch (error){
			error_formatting(error as AxiosError<ApiError>);
		}
	}

	public static async getPeriod(id: string): Promise<TERPeriod>{
		try {
			const res = await api.get<TERPeriodStats>(`/ter/periods/${id}`);
			return res.data;		
		} catch (error){
			error_formatting(error as AxiosError<ApiError>);
		}
	}

	public static async createPeriod(title: string, academic_year: string, start_date: string, end_date: string, groupStartDate: string, groupEndDate: string, assignmentDate: string): Promise<TERPeriod[]> {
		try {
			// const p: TERPeriodCreatePayload = {
			// 	name: title,
			// 	academic_year: academic_year,
			// 	group_formation_start: groupStartDate,
			// 	group_formation_end: groupEndDate,
			// 	subject_selection_start: groupStartDate,
			// 	subject_selection_end: groupEndDate,
			// 	assignment_date: assignmentDate,
			// 	project_start: start_date,
			// 	project_end: end_date,
			// 	min_group_size: 2,
			// 	max_group_size: 4,
			// };

			const mock: TERPeriodCreatePayload = {
				name: "TER Informatique",
				academic_year: "2026-2027",
				group_formation_start: "2026-09-01",
				group_formation_end: "2026-09-10",
				subject_selection_start: "2026-09-11",
				subject_selection_end: "2026-09-25",
				assignment_date: "2026-09-30",
				project_start: "2026-10-01",
				project_end: "2027-01-31",
				min_group_size: 2,
				max_group_size: 4,
			};

			const res = await api.post<TERPeriod>("/ter/periods/", mock);
			return res.data;
		} catch (error){
			error_formatting(error as AxiosError<ApiError>);
		}
	}
}