import api from "../api/ApiHandle";
import { AxiosError } from "axios";

export interface Notification {
    id: number;
    title: string;
    message: string;
    created_at: string;
    isRead: boolean;
    type: string;
}
class NotificationService {
    private notifcations: Notification[] = [];
    private callbacks: Set<NotificationCallback> = new Set ();
    private eventSource: EventSource | null = null;

    constructor() {
        this.fetchHistory();
    }

    private formatDate(dateString: string): string {
        const date = new Date(dateString);
        return `Le ${date.toLocaleDateString()} à ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    public async fetchHistory() {
        try {
            const response = await api.get<Notification[]>("/notifications/history");
            this.notifcations = response.data.map ( n => ({...n, created_at: this.formatDate(n.created_at)})).sort((a,b) => b.id -a.id);
            this.notify();
        }catch (err) {
            console.error("Erreur lors du chargement de l'historique:", err);
        }
    }

    public subscribe(callback: NotificationCallback) {
        this.callbacks.add(callback);
        callback(this.notifcations);

        if(!this.eventSource) {
            this.connectSSE();
        }

        return () => {
            this.callbacks.delete(callback);
        };
    }

    private connectSSE() {
        this.eventSource = new EventSource (`${this.apiUrl}/api/notifications/stream`, {withCredentials: true,});

        this.eventSource.onmessage= (event) => {
            const data = JSON.parse(event.data);
            const newNotif: Notification = { ...data, created_at: this.formatDate(data.created_at)};

            this.notifcations = [newNotif, ...this.notifcations];
            this.notify();
        };

        this.eventSource.onerror = () => {
            console.warn("Connexion SSE perdue. Tentative de reconnexion...");
            this.eventSource?.close();
            this.eventSource=null;
            setTimeout(() => this.connectSSE(), 5000);
        };
    }

    public async markAsRead(id: number) {
        try {
            await api.patch(`/notifications/${id}/read/`);
            this.notifcations = this.notifcations.map(n => n.id === id? { ...n, isRead: true } : n);
            this.notify();
        }catch(err) {
            console.error("Erreur markAsRead: ", err);
        }
    }

    public async markAllAsRead() {
        try {
            await api.patch(`/notifications/mark-all-read/`);
            this.notifcations = this.notifcations.map(n =>  ({ ...n, isRead: true }));
            this.notify();
        }catch(err) {
            console.error("Erreur markAllAsRead: ", err);
        }
    }

    private notify() {
        this.callbacks.forEach(cb => cb([...this.notifcations]));
    }
}
export default new NotificationService();