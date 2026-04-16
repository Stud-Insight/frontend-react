import { AxiosError } from "axios";
import api, { errorFormat, ApiError } from "../api/ApiHandle";

export enum DeliverableType {
	REPORT = "report",
	CODE = "code",
	PRESENTATION = "presentation",
	OTHER = "other",
}

export const DeliverableTypeLabel: Record<DeliverableType, string> = {
	[DeliverableType.REPORT]: "Rapport",
	[DeliverableType.CODE]: "Code",
	[DeliverableType.PRESENTATION]: "Présentation",
	[DeliverableType.OTHER]: "Autre",
};

export interface Deliverable {
	id: string;
	original_filename: string;
	content_type: string;
	size: number;
	deliverable_type: string;
	is_confidential: boolean;
	upload_status: string;
	created: string;
}

export interface DeliverableUploadResponse {
	success: boolean;
	message: string;
	deliverable_id: string;
	upload_status: string;
	is_async: boolean;
}

export default class DeliverableService {
	public static async listGroupDeliverables(group_id: string): Promise<Deliverable[]> {
		try {
			const res = await api.get<Deliverable[]>(`/ter/deliverables/group/${group_id}`);
			return res.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
			return [];
		}
	}

	public static async uploadDeliverable(
		group_id: string,
		file: File,
		deliverable_type: DeliverableType = DeliverableType.OTHER,
		description: string = "",
		is_confidential: boolean = false,
	): Promise<DeliverableUploadResponse | null> {
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("deliverable_type", deliverable_type);
			formData.append("description", description);
			formData.append("is_confidential", String(is_confidential));

			const res = await api.post<DeliverableUploadResponse>(
				`/ter/deliverables/upload/${group_id}`,
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } },
			);
			return res.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
			return null;
		}
	}

	public static async deleteDeliverable(deliverable_id: string): Promise<void> {
		try {
			await api.delete(`/ter/deliverables/${deliverable_id}`);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static downloadDeliverable(deliverable_id: string): void {
		window.open(`${process.env.API_URL}/ter/deliverables/${deliverable_id}/download`, "_blank");
	}
}
