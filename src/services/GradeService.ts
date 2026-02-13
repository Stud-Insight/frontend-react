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

export default class GradeService {
	public static async	getGrades(ter_period_id: string): Promise<Grade[]>{
		try {
			const mock1: Grade = {
				ter_period_id: null,
				id: "1",
				name: "Final Presentation",
				coefficient: 0.4,
				sub_grades: [
					{ 
						id: "11", 
						name: "Technical Quality", 
						coefficient: 0.4,
						max: 20
					},
					{ 
						id: "11", 
						name: "Clarity of Explanation", 
						coefficient: 0.3, 
						max: 20
					},
					{ 
						id: "11", 
						name: "Answers to Questions", 
						coefficient: 0.2, 
						max: 20 
					},
					{ 
						id: "11", 
						name: "Visual Support", 
						coefficient: 0.1, 
						max: 20
					}
				]
			}

			const mock2: Grade = {
				ter_period_id: null,
				id: "2",
				name: "Team Work",
				coefficient: 0.3,
				sub_grades: [],
			}

			const mock3: Grade = {
				ter_period_id: null,
				id: "3",
				name: "Final Report",
				coefficient: 0.3,
				sub_grades: [
				]
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