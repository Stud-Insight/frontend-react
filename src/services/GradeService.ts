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
	public static async	getGrades(ter_period_id: string): Promise<Grade[]>{
		try {
			const mock1: Grade = {
				ter_period_id: null,
				id: "1",
				name: "Présentation finale",
				coefficient: 0.4,
				sub_grades: [
					{ 
						id: "11", 
						name: "Qualité technique", 
						coefficient: 0.4,
						max: 20
					},
					{ 
						id: "11", 
						name: "Clarté de l'explication", 
						coefficient: 0.3, 
						max: 20
					},
					{ 
						id: "11", 
						name: "Réponses aux questions", 
						coefficient: 0.2, 
						max: 20 
					},
					{ 
						id: "11", 
						name: "Support visuel", 
						coefficient: 0.1, 
						max: 20
					}
				]
			}

			const mock2: Grade = {
				ter_period_id: null,
				id: "2",
				name: "Travail en équipe",
				coefficient: 0.3,
				sub_grades: [],
			}

			const mock3: Grade = {
				ter_period_id: null,
				id: "3",
				name: "Rapport final",
				coefficient: 0.3,
				sub_grades: []
			}

			return [mock1, mock2, mock3];
		} catch (err){
			errorFormat(err as AxiosError<ApiError>);
		}
	}
	
	public static async addMainGrade(ter_period_id: string): Promise<void> {
		try {

		} catch (err){
			errorFormat(err as AxiosError<ApiError>);
		}
	}

	public static async addSubGrade(ter_period_id: string, grade_id: string): Promise<void> {
		try {

		} catch (err){
			errorFormat(err as AxiosError<ApiError>);
		}
	}
}