import { AxiosError } from "axios";
import api, { errorFormat, ApiError } from "../api/ApiHandle";

export interface TERDeliverableListItem {
	id: string;
	original_filename: string;
	content_type: string;
	size: number;
	deliverable_type: string;
	is_confidential: boolean;
	upload_status: string;
	created: string;
}

export default class DeliverableService {
	public static async getGroupDeliverables(groupId: string): Promise<TERDeliverableListItem[]> {
		try {
			const response = await api.get<TERDeliverableListItem[]>(`/ter/deliverables/group/${groupId}`);
			return response.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}
}
