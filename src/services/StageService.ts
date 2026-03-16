import { AxiosError } from "axios";
import api, { errorFormat, ApiError } from "../api/ApiHandle";
import { User } from "./UserService";

export enum StageOfferStatus {
	DRAFT = "draft",
	SUBMITTED = "submitted",
	VALIDATED = "validated",
	REJECTED = "rejected"
}

export enum StagePeriodStatus {
	DRAFT = "draft",
	OPEN = "open",
	CLOSED = "closed",
	ARCHIVED = "archived"
};

export enum ApplicationStatus {
	PENDING = "pending",
	ACCEPTED = "accepted",
    REJECTED = "rejected",
    WITHDRAWN = "withdrawn",
    CONFIRMED = "confirmed",
}

export const StageOfferStatusLabel: Map<StageOfferStatus, string> = new Map([
	[StageOfferStatus.DRAFT, "Brouillon"],
	[StageOfferStatus.SUBMITTED, "Soumis"],
	[StageOfferStatus.VALIDATED, "Validé"],
	[StageOfferStatus.REJECTED, "Rejeté"],
]);

export const StagePeriodStatusLabel: Map<StagePeriodStatus, string> = new Map([
	[StagePeriodStatus.DRAFT, "Brouillon"],
	[StagePeriodStatus.OPEN, "Ouvert"],
	[StagePeriodStatus.CLOSED, "Cloture"],
	[StagePeriodStatus.ARCHIVED, "Archivé"],
]);

export const ApplicationStatusLabel: Map<ApplicationStatus, string> = new Map([
	[ApplicationStatus.PENDING, "En attente"],
	[ApplicationStatus.ACCEPTED, "Accepté"],
	[ApplicationStatus.REJECTED, "Rejeté"],
	[ApplicationStatus.WITHDRAWN, "Retiré"],
	[ApplicationStatus.CONFIRMED, "Confirmé"],
]);

export interface StagePeriod {
	id: string;
	name: string;
	academic_year: string;
	status: StagePeriodStatus;
	offer_submission_start: string;
	offer_submittion_end: string;
	application_start: string;
	application_end: string;
	internship_start: string;
	internship_end: string;
	created: string;
	modified: string;
};

export interface StagePeriodCreate {
	name: string;
	academic_year: string;
	offer_submission_start: string;
	offer_submittion_end: string;
	application_start: string;
	application_end: string;
	internship_start: string;
	internship_end: string;
};

export interface StageOffer {
	id: string;
	stage_period_id: string
	title: string;
	description: string;
	company_name: string;
	location: string;
	prerequisites: string;
	supervisor: User;
	max_students: number;
	status: StageOfferStatus;
	rejection_reaso: string;
	created: string;
	modified: string;
	is_favorite: boolean;
};

interface StageOffreCreate {
	stage_period_id: string;
	title: string;
	description: string;
	company_name: string;
	location: string;
	domain: string;
	prerequisites: string;
	max_students: number;
};

export default class StageService {
	public static async getStagePeriodList(): Promise<StagePeriod[]> {
		try {
			const res = await api.get<StagePeriod[]>(`/stages/periods/`);
			return res.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	};

	public static async getStagePeriod(stage_period_id: string): Promise<StagePeriod> {
		try {
			const res = await api.get<StagePeriod>(`/stages/periods/${stage_period_id}`);
			return res.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	};

	public static async createStagePeriod(name: string, academic_year: string, offer_submission_start: string, offer_submittion_end: string, application_start: string, application_end: string, internship_start: string, internship_end: string): Promise<void> {
		try {
			const payload: StagePeriodCreate = {
				name: name,
				academic_year: academic_year,
				offer_submission_start: offer_submission_start,
				offer_submittion_end: offer_submittion_end,
				application_start: application_start,
				application_end: application_end,
				internship_start: internship_start,
				internship_end: internship_end
			};

			await api.post<StagePeriod>(`/stages/periods/`, payload);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
 	}
	
	public static async getStagePeriodOfferList(stage_period_id: string): Promise<StageOffer[]> {
		try {
			const res = await api.get<StageOffer[]>(`/stages/offers/?stage_period_id=${stage_period_id}`);
			return res.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getStageOfferList(): Promise<StageOffer[]> {
		try {
			const res = await api.get<StageOffer[]>(`/stages/offers/`);
			return res.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async createStageOffer(period_id: string, title: string, description: string, company_name: string, location: string, max_students: number): Promise<void> {
		try {
			const payload: StageOffreCreate = {
				stage_period_id: period_id,
				title: title,
				description: description,
				company_name: company_name,
				location: location,
				domain: "",
				prerequisites: "",
				max_students: max_students
			};

			await api.post(`/stages/offers/`, payload);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getStageOffer(stage_offre_id: string): Promise<StageOffer> {
		try {
			const res = await api.get<StageOffer>(`/stages/offers/${stage_offre_id}`);
			return res.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async updateStageOffer(stage_offre_id: string, title: string, description: string, company_name: string, location: string, max_students: number): Promise<void> {
		try {
			const payload = {
				title: title,
				description: description,
				company_name: company_name,
				location: location,
				domain: "",
				prerequisites: "",
				max_students: max_students
			};
			await api.post(`/stages/offers/${stage_offre_id}`, payload);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async submitStageOffer(stage_offre_id: string): Promise<void> {
		try {
			await api.post(`/stages/offers/${stage_offre_id}/submit`);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async validateStageOffer(stage_offre_id: string): Promise<void> {
		try {
			await api.post(`/stages/offers/${stage_offre_id}/validate`);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async rejectStageOffre(stage_offre_id: string): Promise<void> {
		try {
			await api.post(`/stages/offers/${stage_offre_id}/reject`);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async exportCsv(periodId: string): Promise<void> {
		try {
			const res = await api.get(`/stages/dashboard/export/${periodId}/csv`, {
				responseType: 'blob',
			});
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `export_stages_${periodId}.csv`);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getWarnings(periodId: string): Promise<import('./TERService').WorkflowWarningsResponse> {
		try {
			const res = await api.get<import('./TERService').WorkflowWarningsResponse>(`/stages/dashboard/warnings/${periodId}`);
			return res.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}
}