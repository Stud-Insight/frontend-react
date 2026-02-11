import { AxiosError } from "axios";
import { User } from "./UserService"
import { Subject, SubjectStatus } from "./SubjectService";
import api, { errorFormat, ApiError } from "../api/ApiHandle";

export enum TERStatus {
	DRAFT = "draft", 
	OPEN = "open",
	CLOSED = "closed",
	ARCHIVED = "archived"
};

export const TERStatusLabel: Map<TERStatus, string> = new Map([
	[TERStatus.DRAFT, "Brouillon"],
	[TERStatus.OPEN, "En Cours"],
	[TERStatus.CLOSED, "Terminé"],
	[TERStatus.ARCHIVED, "Archivé"],
]);

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
  	project?: Subject;
	correcteur?: User;	
};

export interface TERSubject {
	id: string;
	title: string;
	description: string;
	domain: string;
	status: TERStatus;
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
	status: TERStatus;
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
    students_enrolled: number;
    students_in_groups: number;
    students_solitaires: number;
    groups_total: number;
    groups_complete: number;
    groups_assigned: number;
    subjects_total: number;
    subjects_validated: number;
    subjects_assigned: number;
}

interface AddStudentSchema {
	user_id: string;
}

interface GroupCreateSchema {
	name: string;
	ter_period_id: string;
}

export default class TERService {
	public static async getAllGroups(id: string): Promise<Group[]> {
		 try {
			const res = await api.get<Group[]>(`/groups/?ter_period_id=${id}`);
			return res.data.results;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getEnrolledStudents(id: string): Promise<User[] | null> {
		try {
			const res = await api.get<User[]>(`/ter/periods/${id}/students`);
			return res.data.results;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getEnrolledTeachers(id: string): Promise<User[] | null> {
		try {
			const res = await api.get<User[]>(`/ter/periods/${id}/encadrants`);
			return res.data.results;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async addEnroleStudent(period_id: string, id: string): Promise<void> {
		try {
			const load: AddStudentSchema = {
				user_id: id
			}

			await api.post<{added: number; total_enrolled: number}>(`/ter/periods/${period_id}/students`, load);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getAllPeriods(): Promise<TERPeriod[] | null> {
		try {
			const res = await api.get<TERPeriod[]>("/ter/periods/");
			return res.data;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getPeriodStats(id: string): Promise<TERPeriodStats | null> {
		try {
			const res = await api.get<TERPeriodStats>(`/ter/periods/${id}/stats`);
			return res.data;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getUserPeriod(): Promise<TERPeriod | null>{
		try {
			const periods = await api.get<TERPeriod[]>("/ter/periods/");

			if (periods && periods.data.length > 0){
				return periods.data[0];
			}
			
			return null;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getPeriod(id: string): Promise<TERPeriod | null>{
		try {
			const res = await api.get<TERPeriod>(`/ter/periods/${id}`);
			return res.data;		
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async createPeriod(title: string, academic_year: string, start_date: string, end_date: string, groupStartDate: string, groupEndDate: string, projectStartDate: string, projectEndDate: string, assignmentDate: string): Promise<TERPeriod[] | null> {
		try {
			const load: TERPeriodCreatePayload = {
				name: title,
				academic_year: academic_year,
				group_formation_start: groupStartDate,
				group_formation_end: groupEndDate,
				subject_selection_start: projectStartDate,
				subject_selection_end: projectEndDate,
				assignment_date: projectEndDate,
				project_start: start_date,
				project_end: end_date,
				min_group_size: 2,
				max_group_size: 4,
			};
			
			const res = await api.post<TERPeriod[]>("/ter/periods/", load);
			return res.data;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}
}