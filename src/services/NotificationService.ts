import { AxiosError } from "axios";
import api, { errorFormat, ApiError } from "../api/ApiHandle";

export interface Notification {
    id: number;
    title: string;
    message: string;
    created_at: string;
    isRead: boolean;
    type: string;
}

export default class NotificationService {
	public static async fetchNotifications(): Promise<Notification[]> {
		try {
			const response = await api.get<Notification[]>("/notifications/history/");
			return response.data;
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	};

	public static async markAsRead (id: number): Promise<void> {
		try {
			await api.patch(`/notifications/${id}/read/`);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	};

	public static async markAllAsRead(): Promise<void> {
		try {
			await api.patch(`/notifications/mark-all-read/`, {});
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	};

	public static subscribeToNotifications = (onNotification: (notification: Notification) => void): (() => void) => {
		let eventSource: EventSource | null = null;
		let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

		const connect = () => {
			eventSource = new EventSource(`${api.defaults.baseURL}/api/notifications/stream`, { withCredentials: true });

			eventSource.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					const notificationWithDate: Notification = { ...data, created_at: data.created_at ||new Date().toISOString()

					};
					onNotification(notificationWithDate);
				} catch (error) {
					errorFormat(error as AxiosError<ApiError>);
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