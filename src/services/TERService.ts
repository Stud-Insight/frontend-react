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

export interface TERStudent {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
}

export default class TERService {
	public static async getEnrolledStudents(id: string): Promise<User[] | null> {
		try {
			const res = await api.get<TERStudent[]>(
				`/ter/periods/${id}/students`
			);

			const users: User[] = res.data.map((student) => ({
				id: student.id,
				first_name: student.first_name,
				last_name: student.last_name,
				email: student.email,
				groups: [],
			}));

			return users;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async addEnroleStudents(period_id: string, stud_ids: string[]): Promise<{ added: number; total_enrolled: number } | null> {
		try {
			const p = {
				student_ids: stud_ids
			}

			const res = await api.post<{added: number; total_enrolled: number}>(`/ter/periods/${period_id}/students`, p);

			return res.data;
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

	public static async getPeriod(id: string): Promise<TERPeriod | null>{
		try {
			const res = await api.get<TERPeriod>(`/ter/periods/${id}`);
			return res.data;		
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async createPeriod(title: string, academic_year: number, start_date: string, end_date: string, groupStartDate: string, groupEndDate: string, assignmentDate: string): Promise<TERPeriod[] | null> {
		try {
			// const mock: TERPeriodCreatePayload = {
			// 	name: "TER Informatique",
			// 	academic_year: "2026-2027",
			// 	group_formation_start: "2026-09-01",
			// 	group_formation_end: "2026-09-10",
			// 	subject_selection_start: "2026-09-11",
			// 	subject_selection_end: "2026-09-25",
			// 	assignment_date: "2026-09-30",
			// 	project_start: "2026-10-01",
			// 	project_end: "2027-01-31",
			// 	min_group_size: 2,
			// 	max_group_size: 4,
			// };

			const load: TERPeriodCreatePayload = {
				name: title,
				academic_year: `${academic_year - 1}-${academic_year}`,
				group_formation_start: groupStartDate ,
				group_formation_end: groupEndDate,
				subject_selection_start: "2026-09-11",
				subject_selection_end: "2026-09-25",
				assignment_date: assignmentDate,
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