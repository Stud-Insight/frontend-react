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

export const TERStatusColor: Map<TERStatus, string> = new Map([
	[TERStatus.DRAFT, "var(--gray1-col)"],
	[TERStatus.OPEN, "var(--green-col)"],
	[TERStatus.CLOSED, "var(--blue-col)"],
	[TERStatus.ARCHIVED, "var(--purple-col)"],
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

export interface StudentPhase {
	current_phase: string;
	current_phase_label: string;
	next_deadline: string | null;
	next_deadline_label: string | null;
	days_remaining: number | null;
}

export interface StudentDashboard {
	ter_period_id: string | null;
	ter_period_name: string | null;
	status: string;
	phase: StudentPhase | null;
	group_name: string | null;
	group_id: string | null;
	subject_title: string | null;
	subject_id: string | null;
}

export interface EncadrantGroupDeliverable {
	total: number;
	submitted: number;
}

export interface EncadrantGroup {
	id: string;
	name: string;
	members: { id: string; email: string; first_name: string; last_name: string }[];
	subject_title: string;
	subject_id: string;
	deliverables: EncadrantGroupDeliverable;
	grade_status: string | null;
	group_grade: number | null;
}

export interface EncadrantDashboard {
	ter_period_id: string;
	ter_period_name: string;
	groups: EncadrantGroup[];
	total_groups: number;
	graded_groups: number;
	finalized_groups: number;
}

export interface AdminSystemStats {
	total_users: number;
	active_users: number;
	total_students: number;
	total_encadrants: number;
	total_externes: number;
	active_ter_periods: number;
	draft_ter_periods: number;
	archived_ter_periods: number;
	active_stage_periods: number;
}

export const PhaseColors: Record<string, string> = {
	formation: "var(--blue-col)",
	selection: "var(--orange-col)",
	assignment: "var(--purple-col)",
	execution: "var(--green-col)",
	finished: "var(--gray1-col)",
	upcoming: "var(--cyan-col)",
	unknown: "var(--gray1-col)",
};

export default class TERService {
	public static async getStudents(id: string): Promise<User[]> {
		try {
			const res = await api.get<{results: User[]}>(`/ter/periods/${id}/students`);
			return res.data.results;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async addStudent(period_id: string, user_id: string): Promise<void> {
		try {
			await api.post<{added: number; total_enrolled: number}>(`/ter/periods/${period_id}/students/${user_id}`);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async deleteStudent(period_id: string, user_id: string): Promise<void> {
		try {
			await api.delete<{added: number; total_enrolled: number}>(`/ter/periods/${period_id}/students/${user_id}`);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getProfessors(period_id: string): Promise<User[]> {
		try {
			const res = await api.get<{results: User[]}>(`/ter/periods/${period_id}/encadrants`);
			return res.data.results;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async addProfessor(period_id: string, professor_id: string): Promise<void> {
		try {
			await api.post<{results: User[]}>(`/ter/periods/${period_id}/encadrants/${professor_id}`);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async deleteProfessor(period_id: string, professor_id: string): Promise<void> {
		try {
			await api.delete<{results: User[]}>(`/ter/periods/${period_id}/encadrants/${professor_id}`);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getPeriods(): Promise<TERPeriod[]> {
		try {
			const res = await api.get<TERPeriod[]>("/ter/periods/");
			return res.data;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getPeriodStats(id: string): Promise<TERPeriodStats> {
		try {
			const res = await api.get<TERPeriodStats>(`/ter/periods/${id}/stats`);
			return res.data;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getSubjects(ter_id: string): Promise<Subject[]> {
		try {
			const res = await api.get<{results: Subject[]}>(`/ter/subjects?ter_period_id=${ter_id}`);
			return res.data.results;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	} 

	public static async getMyPeriods(): Promise<TERPeriod[]> {
		try {
			const res = await api.get<TERPeriod[]>(`/ter/periods/me`);
			return res.data;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getPeriod(period_id: string): Promise<TERPeriod | null>{
		try {
			const res = await api.get<TERPeriod>(`/ter/periods/${period_id}`);
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

	public static async getStudentDashboard(periodId?: string): Promise<StudentDashboard> {
		try {
			const url = periodId
				? `/ter/dashboard/student?ter_period_id=${periodId}`
				: `/ter/dashboard/student`;
			const res = await api.get<StudentDashboard>(url);
			return res.data;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getEncadrantPeriods(): Promise<{id: string; name: string; academic_year: string; status: string}[]> {
		try {
			const res = await api.get<{id: string; name: string; academic_year: string; status: string}[]>(`/ter/dashboard/encadrant/periods`);
			return res.data;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getEncadrantDashboard(periodId: string): Promise<EncadrantDashboard> {
		try {
			const res = await api.get<EncadrantDashboard>(`/ter/dashboard/encadrant/${periodId}`);
			return res.data;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getAdminStats(): Promise<AdminSystemStats> {
		try {
			const res = await api.get<AdminSystemStats>(`/ter/dashboard/admin/stats`);
			return res.data;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static exportCsvUrl(periodId: string): string {
		return `${api.defaults.baseURL}/ter/dashboard/export/${periodId}/csv`;
	}
}