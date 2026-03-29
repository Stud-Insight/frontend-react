import { AxiosError } from "axios";
import api, { errorFormat, ApiError } from "../api/ApiHandle";

export interface Notification {
	id: string;
	notification_type: string;
	title: string;
	message: string;
	data: Record<string, unknown> | null;
	is_read: boolean;
	read_at: string | null;
	created: string;
}

export interface NotificationPreferences {
	email_messages: boolean;
	email_assignments: boolean;
	email_stages: boolean;
	email_groups: boolean;
}

export const mockNotifications: Notification[] = [
	{
		id: "1",
		notification_type: "chat.new_message",
		title: "New message",
		message: "You received a new message from Alice.",
		data: { sender_id: "u1", sender_name: "Alice" },
		is_read: false,
		read_at: null,
		created: "2026-03-17T10:15:00Z",
	},
	{
		id: "2",
		notification_type: "group.invitation_received",
		title: "Group invitation",
		message: "You have been invited to join Group Alpha.",
		data: { group_id: "g1", group_name: "Group Alpha" },
		is_read: false,
		read_at: null,
		created: "2026-03-17T09:45:00Z",
	},
	{
		id: "3",
		notification_type: "group.invitation_accepted",
		title: "Invitation accepted",
		message: "Bob accepted your group invitation.",
		data: { user_id: "u2", user_name: "Bob" },
		is_read: true,
		read_at: "2026-03-17T09:30:00Z",
		created: "2026-03-17T09:00:00Z",
	},
	{
		id: "4",
		notification_type: "ter.subject_validated",
		title: "Subject validated",
		message: "Your TER subject has been validated.",
		data: { subject_id: "s1" },
		is_read: false,
		read_at: null,
		created: "2026-03-16T16:20:00Z",
	},
	{
		id: "5",
		notification_type: "ter.subject_rejected",
		title: "Subject rejected",
		message: "Your TER subject has been rejected. Please revise it.",
		data: { subject_id: "s2", reason: "Incomplete description" },
		is_read: true,
		read_at: "2026-03-16T15:00:00Z",
		created: "2026-03-16T14:45:00Z",
	},
	{
		id: "6",
		notification_type: "ter.groups_assigned",
		title: "Groups assigned",
		message: "Student groups have been assigned for the TER period.",
		data: { period_id: "p1" },
		is_read: false,
		read_at: null,
		created: "2026-03-15T12:00:00Z",
	},
	{
		id: "7",
		notification_type: "stage.application_accepted",
		title: "Application accepted",
		message: "Your internship application has been accepted.",
		data: { stage_id: "st1", company: "TechCorp" },
		is_read: false,
		read_at: null,
		created: "2026-03-14T11:10:00Z",
	},
	{
		id: "8",
		notification_type: "stage.application_rejected",
		title: "Application rejected",
		message: "Your application was not selected.",
		data: { stage_id: "st2" },
		is_read: true,
		read_at: "2026-03-14T10:00:00Z",
		created: "2026-03-14T09:30:00Z",
	},
	{
		id: "9",
		notification_type: "stage.supervisor_assigned",
		title: "Supervisor assigned",
		message: "A supervisor has been assigned to your internship.",
		data: { supervisor_id: "sup1", supervisor_name: "Dr. Smith" },
		is_read: false,
		read_at: null,
		created: "2026-03-13T08:00:00Z",
	},
	{
		id: "10",
		notification_type: "group.member_removed",
		title: "Member removed",
		message: "Charlie has been removed from your group.",
		data: { user_id: "u3", user_name: "Charlie" },
		is_read: true,
		read_at: "2026-03-12T18:00:00Z",
		created: "2026-03-12T17:30:00Z",
	},
];

/**
 * Returns the frontend route to navigate to when a notification is clicked.
 * Returns null if no specific route applies.
 */
export function getNotificationRoute(notif: Notification): string | null {
	const data = notif.data || {};
	switch (notif.notification_type) {
		// Chat
		case "chat.new_message":
			return "/dashboard/chat";

		// Groups
		case "group.invitation_received":
		case "group.invitation_accepted":
		case "group.invitation_declined":
		case "group.member_removed":
			return "/dashboard/ter";

		// TER subjects
		case "ter.subject_validated":
		case "ter.subject_rejected":
			return "/dashboard/subjects";

		// TER assignment (student)
		case "ter.subject_assigned":
			return "/dashboard/ter";

		// TER assignment complete (professor)
		case "ter.groups_assigned":
			if (data.period_id) return `/dashboard/ter/${data.period_id}/admin`;
			return "/dashboard/ter";

		// Stages
		case "stage.application_accepted":
		case "stage.application_rejected":
		case "stage.application_confirmed":
		case "stage.supervisor_assigned":
			return "/dashboard/stages";

		default:
			return null;
	}
}

export default class NotificationService {
	public static async fetchNotifications(limit: number = 50, offset: number = 0): Promise<Notification[]> {
		try {
			// const response = await api.get<Notification[]>(`/notifications/?limit=${limit}&offset=${offset}`);
			// return response.data;
			return mockNotifications;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	};

	public static async getUnreadCount(): Promise<number> {
		try {
			const response = await api.get<{ count: number }>("/notifications/unread-count");
			return response.data.count;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	};

	public static async markAsRead(id: string): Promise<Notification> {
		try {
			const response = await api.post<Notification>(`/notifications/${id}/mark-read`);
			return response.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	};

	public static async markAllAsRead(): Promise<void> {
		try {
			await api.post("/notifications/mark-all-read");
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	};

	public static async getPreferences(): Promise<NotificationPreferences> {
		try {
			const response = await api.get<NotificationPreferences>("/notifications/preferences");
			return response.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	};

	public static async updatePreferences(prefs: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
		try {
			const response = await api.patch<NotificationPreferences>("/notifications/preferences", prefs);
			return response.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	};

	public static subscribeToNotifications = (onNotification: (notification: Notification) => void): (() => void) => {
		let eventSource: EventSource | null = null;
		let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

		const connect = () => {
			eventSource = new EventSource(`${api.defaults.baseURL}/notifications/stream`, { withCredentials: true });

			eventSource.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					if (data.type === "heartbeat") return;
					onNotification(data as Notification);
				} catch (error) {
					console.error("Erreur SSE parse:", error);
				}
			};

			eventSource.onerror = () => {
				console.warn("Connexion SSE perdue. Reconnexion dans 5s...");
				eventSource?.close();
				reconnectTimeout = setTimeout(connect, 5000);
			};
		};

		connect();

		return () => {
			if (eventSource) {
				eventSource.close();
			}
			if (reconnectTimeout) {
				clearTimeout(reconnectTimeout);
			}
		};
	};
}
