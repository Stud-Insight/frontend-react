import { AxiosError } from "axios";
import api, { errorFormat, ApiError } from "../api/ApiHandle";

export interface Grade {
	ter_period_id?: string | null;
	id: string;
	name: string;
	coefficient: number;
	sub_grades?: Grade[];
	max?: number;
};

export interface ScoredGrade {
	id: string;
	name: string;
	coefficient: number;
	max?: number;
	score?: number | null;
	comment?: string;
	sub_grades?: ScoredGrade[];
};

export interface GroupGradeSummary {
	group_id: string;
	group_name: string;
	total_grade: number | null;
	max_grade: number;
	criteria: ScoredGrade[];
};

export interface TERPeriodMinimal {
	id: string;
	name: string;
};

export const GradeStatusLabel: Record<string, string> = {
	draft: "Brouillon",
	submitted: "Soumis",
	finalized: "Finalise",
};

export const GradeStatusColor: Record<string, string> = {
	draft: "var(--gray1-col)",
	submitted: "var(--orange-col)",
	finalized: "var(--green-col)",
};

export default class GradeService {
	// ==================== Criteria (Canvas) ====================

	public static async getGrades(ter_period_id: string): Promise<Grade[]> {
		try {
			const response = await api.get(`/ter/criteria/${ter_period_id}`);
			return response.data;
		} catch (err) {
			errorFormat(err as AxiosError<ApiError>);
		}
	}

	public static async addMainGrade(ter_period_id: string, name: string = "Nouveau critère", coefficient: number = 0.0): Promise<Grade> {
		try {
			const response = await api.post(`/ter/criteria/${ter_period_id}`, {
				name,
				coefficient,
				max_score: 20,
			});
			return response.data;
		} catch (err) {
			errorFormat(err as AxiosError<ApiError>);
		}
	}

	public static async addSubGrade(ter_period_id: string, grade_id: string, name: string = "Nouveau sous-critère", coefficient: number = 0.0): Promise<Grade> {
		try {
			const response = await api.post(`/ter/criteria/${ter_period_id}/${grade_id}/sub`, {
				name,
				coefficient,
				max_score: 20,
			});
			return response.data;
		} catch (err) {
			errorFormat(err as AxiosError<ApiError>);
		}
	}

	public static async updateGrade(criterion_id: string, data: {
		name?: string;
		coefficient?: number;
		max_score?: number;
		order?: number;
		parent_id?: string;
		remove_parent?: boolean;
	}): Promise<Grade> {
		try {
			const response = await api.put(`/ter/criteria/detail/${criterion_id}`, data);
			return response.data;
		} catch (err) {
			errorFormat(err as AxiosError<ApiError>);
		}
	}

	public static async deleteGrade(criterion_id: string): Promise<void> {
		try {
			await api.delete(`/ter/criteria/detail/${criterion_id}`);
		} catch (err) {
			errorFormat(err as AxiosError<ApiError>);
		}
	}

	public static async reorderGrades(ter_period_id: string, items: {
		id: string;
		order: number;
		parent_id?: string | null;
	}[]): Promise<Grade[]> {
		try {
			const response = await api.put(`/ter/criteria/${ter_period_id}/reorder`, { items });
			return response.data;
		} catch (err) {
			errorFormat(err as AxiosError<ApiError>);
		}
	}

	// ==================== Clone ====================

	public static async cloneCriteria(targetPeriodId: string, sourcePeriodId: string): Promise<Grade[]> {
		try {
			const response = await api.post(`/ter/criteria/${targetPeriodId}/clone-from/${sourcePeriodId}`);
			return response.data;
		} catch (err) {
			errorFormat(err as AxiosError<ApiError>);
		}
	}

	// ==================== Scores (Grade Assignment) ====================

	public static async getGroupScores(periodId: string, groupId: string): Promise<GroupGradeSummary> {
		try {
			const response = await api.get(`/ter/scores/${periodId}/${groupId}`);
			return response.data;
		} catch (err) {
			errorFormat(err as AxiosError<ApiError>);
		}
	}

	public static async saveGroupScores(periodId: string, groupId: string, scores: {
		criterion_id: string;
		score: number;
		comment?: string;
	}[]): Promise<GroupGradeSummary> {
		try {
			const response = await api.put(`/ter/scores/${periodId}/${groupId}`, { scores });
			return response.data;
		} catch (err) {
			errorFormat(err as AxiosError<ApiError>);
		}
	}

	public static async getAllScores(periodId: string): Promise<GroupGradeSummary[]> {
		try {
			const response = await api.get(`/ter/scores/${periodId}/summary`);
			return response.data;
		} catch (err) {
			errorFormat(err as AxiosError<ApiError>);
		}
	}
}
