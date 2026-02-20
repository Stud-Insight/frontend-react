import { Notification } from "../components/ui/NotificationWidget";

export const subscribeToNotifications = (onNotificationReceived: (notif: Notification) => void) => {
    const eventSource = new EventSource("http://localhost:8000/api/notifications/stream", {
        withCredentials: true
    });

    eventSource.onmessage =(event) => {
        console.log("🚀 Donnée reçue du Backend :", event.data); 
        const data = JSON.parse(event.data);

        const newNotif: Notification ={
            id: data.id,
            title: data.title,
            description: data.message,
            time: "À l'instant",
            isRead: false
        };

        onNotificationReceived(newNotif);
    };

    eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        eventSource.close();
    };

    return () => eventSource.close ();
}; 