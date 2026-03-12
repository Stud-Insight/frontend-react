import { AxiosError } from "axios";
import api, { errorFormat, ApiError } from "../api/ApiHandle";

export interface Notification {
    id: string;
    title: string;
    message: string;
    created_at: string;
    isRead: boolean;
    type: string;
}

const notif_mock: Notification[] = [
	{
		id: "1", 
		title: "Nouveau TER", 
		message: "Un nouveau sujet sur l'IA est disponible.", 
		created_at: "2026-02-08 10:00", 
		isRead: false,
		type: ""
	},
	{ 
		id: "2", 
		title: "Stage Validé", 
		message: "Votre convention a été signée par l'administration.", 
		created_at: "2026-02-07 14:30", 
		isRead: true,
		type: ""
	}
];

export default class NotificationService {
	public static async fetchNotifications(): Promise<Notification[]> {
		try {
			//QUE TEMP
			return notif_mock;
			
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