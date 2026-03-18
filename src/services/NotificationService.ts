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
			const response = await api.get<Notification[]>(`/notifications/?limit=${limit}&offset=${offset}`);
			return response.data;
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
