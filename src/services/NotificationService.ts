import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import { Notification } from "../components/ui/NotificationWidget";

dayjs.extend(relativeTime);
dayjs.locale('fr');

const API_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:8000";

export const subscribeToNotifications = (onNotificationReceived: (notif: Notification) => void) => {
    let eventSource: EventSource | null =null ;
    let reconnectDelay = 1000;
    const maxReconnectDelay = 30000;

    const connect = () => {
        console.log("Tentative de connexion au flux SSE...");
        eventSource= new EventSource(`${API_URL}/api/notifications/stream/`, {withCredentials: true});

    eventSource.onopen = () => {
        console.log("Connexion SSE établie");
        reconnectDelay = 1000;
    };

    eventSource.onmessage =(event) => {
        try {
            const data = JSON.parse(event.data);
            const newNotif: Notification ={
            id: data.id,
            title: data.title,
            description: data.message,
            time: "À l'instant",
            isRead: false
        };

        onNotificationReceived(newNotif);
        } catch (err) {
            console.error("Erreur pasing SSE data:", err);
        }
    };

    eventSource.onerror = () => {
        console.error(`❌ Erreur SSE. Reconnexion dans ${reconnectDelay}ms...`);
        if (eventSource) eventSource.close();

        setTimeout (() => {
            reconnectDelay = Math.min(reconnectDelay *2, maxReconnectDelay);
            connect ();
        }, reconnectDelay);
    };
};

    return () => {
        if (eventSource) {
            eventSource.close();
            console.log("Connexion SSE fermée");
        }
        };
    };