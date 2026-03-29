import { AxiosError } from "axios";
import { User } from "./UserService"
import api, { errorFormat, ApiError } from "../api/ApiHandle";

export enum SubjectStatus {
	DRAFT = "draft",
	SUBMITTED = "submitted",
	VALIDATED = "validated",
	REJECTED = "rejected"
};

export interface SubjectRank {
	subject_id: string;
	subject_title: string;
	rank: number;
};

export const SubjectStatusColor: Map<SubjectStatus, string> = new Map([
	[SubjectStatus.DRAFT, "var(--gray1-col)"],
	[SubjectStatus.SUBMITTED, "var(--blue-col)"],
	[SubjectStatus.VALIDATED, "var(--green-col)"],
	[SubjectStatus.REJECTED, "var(--red-col)"],
]);

export const SubjectTags: string[] = [
	"JavaScript",
	"TypeScript",
	"HTML",
	"CSS",
	"Python",
	"Java",
	"C",
	"C++",
	"C#",
	"OCaml",
	"PHP",
	"Ruby",
	"Perl",
	"Lua",
];

export const SubjectStatusLabel: Map<SubjectStatus, string> = new Map([
	[SubjectStatus.DRAFT, "Brouillon"],
	[SubjectStatus.SUBMITTED, "Soumis"],
	[SubjectStatus.VALIDATED, "Approuvé"],
	[SubjectStatus.REJECTED, "Rejeté"]
]);

export interface SubjectCreateSchema {
	ter_period_id: number | null;
	title: string;
	description: string;
	domain: string;
	tags: string[];
	taches: string[];
	prerequisites: string;
	max_groups: number;
	min_group_size: number;
	max_group_size: number;
};

export interface Subject {
	id: string;
	title: string;
	description: string;
	domain: string;
	tags: string[];
	taches: string[];
	prerequisites: string;
	professor: User | null;
	supervisor: User | null;
	max_groups: number;
	min_group_size: number | null;
	max_group_size: number | null;	
	status: SubjectStatus;
	rejection_reason: string | null;
	ter_period_id: string;
	created: string;
	modified: string;
	is_favorite: boolean;
};

export default class SubjectService {
	public static async createSubject(title: string, desc: string, min_group: number, max_group: number, tags: Set<string>, files: File[]): Promise<void> {
		try {
			const load: SubjectCreateSchema = {
				ter_period_id: null,
				title: title, 
				description: desc,
				domain: "",
				prerequisites: "",
				max_groups: 1,
				min_group_size: min_group,
				max_group_size: max_group,
				tags: Array.from(tags),
				taches: [],
			};

			await api.post<SubjectCreateSchema>(`/ter/subjects/`, load);
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	};

	public static async addFavouriteSubject(subject_id: string): Promise<void> {
		try {
			await api.post(`/ter/subjects/${subject_id}/favorite`);
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}	
	}

	public static async removeFavouriteSubject(subject_id: string): Promise<void> {
		try {
			await api.delete(`/ter/subjects/${subject_id}/favorite`);
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}	
	}

	public static async getUserSubjects(): Promise<Subject[]> {
		try {
			const res = await api.get<{results: Subject[]}>(`/ter/subjects/me`);
			return res.data.results;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}	
	}

	public static async publishSubject(period_ids: Set<string>, subject_id: string): Promise<void> {
		try {
			await Promise.all(
				Array.from(period_ids).map(id => (
					api.post(`ter/subjects/${subject_id}/submit?ter_period_id=${id}`)
				))
			);
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async rejectSubject(subject_id: string): Promise<void> {
		try {
			await api.post(`ter/subjects/${subject_id}/reject`)
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async acceptSubject(subject_id: string): Promise<void> {
		try {
			await api.post(`ter/subjects/${subject_id}/validate`)
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async submitGroupRankingSubject(group_id: string, ranks: SubjectRank[]): Promise<void>{
		try {
			await api.post(`ter/rankings/${group_id}`, ranks);
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getGroupSubjectRanking(group_id: string): Promise<SubjectRank[]>{
		try {
			const res = await api.get(`ter/rankings/${group_id}`);
			return res.data.rankings;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async submitMemberSubjectRanking(group_id: string, ranks: SubjectRank[]): Promise<void>{
		try {
			await api.post(`ter/rankings/${group_id}/individual`, {
				rankings: ranks
			});
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getMemberSubjectRanking(group_id: string): Promise<SubjectRank[]>{
		try {
			const res = await api.get(`ter/rankings/${group_id}/individual`);
			return res.data.members_rankings[0].rankings;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}
}

