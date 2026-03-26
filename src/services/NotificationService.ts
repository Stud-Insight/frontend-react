import ApiHandle from "../api/ApiHandle";


export interface Notification {
    created: string | number | Date;
    id: number;
    title: string;
    message: string;
    created_at: string;
    isRead: boolean;
    type: string;
}

const API_BASE_URL = ApiHandle.defaults.baseURL || "http://localhost:8000";

const fetchNotifications = async (): Promise<Notification[]> => {
    const response = await ApiHandle.get<Notification[]>("/notifications/history/");
    return response.data;
};

const markAsRead = async (id: number): Promise<void> => {
    await ApiHandle.patch(`/notifications/${id}/read/`);
};

const markAllAsRead = async (): Promise<void> => {
    await ApiHandle.patch(`/notifications/mark-all-read/`, {});
};

const subscribeToNotifications = (onNotification: (notification: Notification) => void): (() => void) => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
        eventSource = new EventSource(`${API_BASE_URL}/api/notifications/stream`, { withCredentials: true });

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const notificationWithDate: Notification = { ...data, created_at: data.created_at ||new Date().toISOString()

                };
                onNotification(notificationWithDate);
            } catch (err) {
            console.error("Erreur lors du traitement de la notification SSE:", err);
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

const NotificationService = {
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    subscribeToNotifications
};

export default NotificationService;