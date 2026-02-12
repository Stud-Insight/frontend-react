import { AxiosError } from "axios";
import api, { errorFormat, ApiError } from "../api/ApiHandle";
import { User } from "./UserService";
import { TERPeriod } from "./TERService";
import { TERSubject } from "./TERService";

export enum GroupStatus {
	OUVERT,
	FORME,
	CLOTURE
};

export const GroupStatusLabel: Map<GroupStatus, string> = new Map([
	[GroupStatus.OUVERT, "Ouvert"],
	[GroupStatus.FORME, "Forme"],
	[GroupStatus.CLOTURE, "Fermé"],
]);

export enum InvitationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  CANCELLED = "cancelled",
}

export enum ProjectType {
	TER = "TER",
	STAGE = "Stage"
}

interface GroupCreateSchema {
	name: string;
	ter_period_id: string | null;
	stage_period_id: string | null;
}

export interface Group {
	id: string;
	created: string;
	modified: string;
	name: string;
	leader: User;
	members: User[];
	status: GroupStatus;
	project_type: ProjectType;
	ter_period?: TERPeriod | null;
	stage_period?: null;
	assigned_subject?: TERSubject | null;
	assigned_offer?: null;
	member_count: number;
}

export default class GroupService {
	public static async getAllTERGroups(id: string): Promise<Group[]> {
		 try {
			const res = await api.get<{results: Group[]}>("/groups/", {params: {ter_period_id: id}});
			return res.data.results;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getGroup(id: string): Promise<Group> {
		try {
			const res = await api.get<Group>(`/groups/${id}`);
			return res.data;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}
	public static async createGroup(period_id: string, nom: string, capacite: number): Promise<void> {
		try {
			const load: GroupCreateSchema = {
				name: nom,
				ter_period_id: period_id,
				stage_period_id: null
			};

			console.log(load);

			await api.post("/groups/", load);
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}	
}