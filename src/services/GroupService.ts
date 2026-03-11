import { AxiosError } from "axios";
import api, { errorFormat, ApiError } from "../api/ApiHandle";
import { User } from "./UserService";
import { TERPeriod } from "./TERService";
import { TERSubject } from "./TERService";

export enum GroupStatus {
	OUVERT = "ouvert",
	FORME = "forme",
	CLOTURE = "cloture"
};

export const GroupStatusLabel: Map<GroupStatus, string> = new Map([
	[GroupStatus.OUVERT, "Ouvert"],
	[GroupStatus.FORME, "En Attente"],
	[GroupStatus.CLOTURE, "Cloturé"],
]);

export const GroupStatusColor: Map<GroupStatus, string> = new Map([
	[GroupStatus.OUVERT, "var(--green-col)"],
	[GroupStatus.FORME, "var(--blue-col)"],
	[GroupStatus.CLOTURE, "var(--red-col)"],
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

interface GroupUpdateSchema {
	name: string | null;
	max_group_size: number | null;
}

interface GroupCreateSchema {
	name: string;
	ter_period_id: string | null;
	stage_period_id: string | null;
	max_group_size: number | null;
	member_ids: string[];
}

export interface Group {
	id: string;
	created: string;
	modified: string;
	name: string;
	leader: User | null;
	members: User[];
	max_group_size: number;
	status: GroupStatus;
	project_type: ProjectType;
	ter_period?: TERPeriod | null;
	stage_period?: null;
	assigned_subject?: TERSubject | null;
	assigned_offer?: null;
	member_count: number;
}

export default class GroupService {
	public static async getGroups(period_id: string): Promise<Group[]> {
		try {
			const res = await api.get<{results: Group[]}>("/groups/", {params: {ter_period_id: period_id}});
			return res.data.results;
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async getMyGroup(period_id: string) : Promise<Group> {
		try {
			const res = await api.get<Group[]>(`/groups/my?ter_period_id=${period_id}`);
			return res.data[0];
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

	public static async changeGroupLeader(group_id: string, user_id: string): Promise<void> {
		try {
			await api.post(`/groups/${group_id}/transfer-leadership`, {
				new_leader_id: user_id
			});
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async addMember(group_id: string, user_id: string): Promise<void> {
		try {
			await api.post(`/groups/${group_id}/members`, {
				user_id: user_id
			});
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async removeMember(group_id: string, user_id: string): Promise<void> {
		try {
			await api.delete(`/groups/${group_id}/members/${user_id}`);
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async createGroup(period_id: string, name: string, size: number, users: Set<User>): Promise<void> {
		try {
			const load: GroupCreateSchema = {
				name: name,
				ter_period_id: period_id,
				stage_period_id: null,
				max_group_size: size,
				member_ids: Array.from(users).map(user => {
					return user.id;
				})
			};

			await api.post("/groups/", load);
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}	

	public static async deleteGroup(group_id: string | undefined): Promise<void> {
		try {
			await api.delete(`/groups/${group_id}`);
		} catch (error){
			errorFormat(error as AxiosError<ApiError>);
		}
	}

	public static async updateGroup(group_id: string | undefined, name: string, size: number): Promise<void> {
		try {
			const load: GroupUpdateSchema = {
				name: name,
				max_group_size: size,
			};

			await api.put(`/groups/${group_id}`, load);
		} catch (error){

		}
	}
}