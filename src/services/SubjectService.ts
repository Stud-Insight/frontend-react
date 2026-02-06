import { AxiosError } from "axios";
import { User } from "./UserService"
import api, { errorFormat, ApiError } from "../api/ApiHandle";

export enum SubjectStatus {
	DRAFT = "Brouillon",
	SUBMITTED = "Soumis",
	VALIDATED = "Approuvé",
	REJECTED = "Rejeté",
}

export interface SubjectCreateSchema {
	title: string;
	description: string;
	domain: string;
	prerequisites: string;
	max_groups: number;
	min_group_size: number;
	max_group_size: number;
	tags: string[];
};

export interface Subject {
	id: string;
	title: string;
	description: string;
	domain: string;
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
}

export default class SubjectService {
	public static async createSubject(title: string, desc: string, min_group: number, max_group: number, tags: Set<string>, files: File[]): Promise<void> {
		try {
			const load: SubjectCreateSchema = {
				title: title, 
				description: desc,
				domain: "elelelel",
				prerequisites: "",
				max_groups: 1,
				min_group_size: min_group,
				max_group_size: max_group,
				tags: Array.from(tags),
			};

			console.log(load);

			await api.post<SubjectCreateSchema>(`/ter/subjects/`, load);
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	};

	public static async getUserSubjects(): Promise<Subject[]> {
		try {
			const res = await api.get<Subject[]>(`/ter/subjects/me`);
			return res.data;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}	
	}
}

