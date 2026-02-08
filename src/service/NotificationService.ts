import { resolve } from "../../webpack.common";

export interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    isRead: boolean;
}

export class NotificationService {
    private static eventSource: EventSource | null = null;

    static connect(onMessage: (count: number) => void) {
        if (this.eventSource) {
            this.eventSource.close();
        }

        this.eventSource = new EventSource('/api/notifications/stream');

        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data.unreadCount);
            }catch (e) {
                console.error("Erreur lors du parsing des donnees SSE", e);
            }
        };
        this.eventSource.onerror = () => {
            console.error ("Connexion SSE perdue. Tentative de reconnexion....");
            this.eventSource?.close();
            setTimeout(() => this.connect(onMessage), 5000);
        };
        console.log("SSE désactivé temporairement pour le debug.");

        // 2. AJOUT POUR LE TEST : Ecouter les événements manuels du bouton
        window.addEventListener('message', (event: any) => {
        try {
            // On vérifie si la donnée est bien celle de notre bouton
            const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            if (data && data.unreadCount !== undefined) {
                onMessage(data.unreadCount);
            }
        } catch (e) {
            // Ignorer les messages qui ne sont pas au format JSON
        }
    });
    }
    static disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null; 
        }
    }
    // Simulation de recuperation de l'historique
    static async getHistory(): Promise<Notification[]> {
        const mockData: Notification[] = [
            {id: "1", title: "Nouveau TER", message:"Un nouveau sujet a été publié.", date: "2026-02-08 09:00", isRead: false},
            {id: "2", title: "Stage Validé", message:"Votre convention pour l'entreprise X est signée.", date: "2026-02-07 14:30", isRead: true},
            {id: "3", title: "Rappel Deadlline", message:"Fin des dépots de voeux dans 48 heures.", date: "2026-02-06 10:00", isRead: false}
        ];

        return new Promise((resolve) => {
            setTimeout(() => resolve(mockData), 500);
        });
    }
    static async markAsRead(id: string): Promise<void> {
        console.log(`Appel API : La notification ${id} est maintenant lue.`);
    }
}