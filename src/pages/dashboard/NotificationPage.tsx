import React, { useState } from "react";
import DashboardPage from "./DashboardPage.tsx";
import "./NotificationPage.css";

// Interface locale pour garantir la structure
interface NotificationItem {
    id: string;
    title: string;
    message: string;
    date: string;
    isRead: boolean;
}

export default function NotificationPage() {
    // DONNÉES EN DUR : On les met ici pour être SÛR qu'elles existent au rendu
    const [notifications, setNotifications] = useState<NotificationItem[]>([
        { 
            id: "1", 
            title: "Nouveau TER", 
            message: "Un nouveau sujet sur l'IA est disponible.", 
            date: "2026-02-08 10:00", 
            isRead: false 
        },
        { 
            id: "2", 
            title: "Stage Validé", 
            message: "Votre convention a été signée par l'administration.", 
            date: "2026-02-07 14:30", 
            isRead: true 
        }
    ]);

    // Fonction pour marquer comme lu (Story 7.6)
    const handleToggleRead = (id: string) => {
        setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    return (
            <div className="notif-page-wrapper">
                <h2 className="notif-page-title">Mes Notifications</h2>
                
                <div className="notif-list">
                    {notifications.map((n) => (
                        <div 
                            key={n.id} 
                            className={`notif-card ${n.isRead ? 'is-read' : 'is-unread'}`}
                            onClick={() => handleToggleRead(n.id)}
                        >
                            <div className="notif-indicator">
                                {!n.isRead && <div className="blue-dot" />}
                            </div>
                            
                            <div className="notif-body">
                                <div className="notif-header">
                                    <span className="notif-title">{n.title}</span>
                                    <span className="notif-date">{n.date}</span>
                                </div>
                                <p className="notif-text">{n.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    );
}