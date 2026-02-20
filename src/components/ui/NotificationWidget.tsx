import React from "react";
import './NotificationWidget.css';

const NotificationWidget: React.FC = () => {
    //Juste des données pour le visuel 
    const notifications = [
        { id: 1, title: "Nouveau message", text: "Vincent vous a envoyé un message.", time: "2 min" },
        { id: 2, title: "Rendu TER ", description: "Le dossier de TER est disponible.", time: "1 heure" },
        { id: 3, title: "Calendrier", description: "Votre soutenance a été programmée.", time: "Hier" },
    ];

    return (
        <div className="notification-widget-dropdown">
            <div className="widget-header">
                <h3>Notifications</h3>
            </div>
            <div className="widget-body">
                {notifications.map((notif) => (
                    <div key={notif.id} className="notification-item">
                        <div className="notification-item-content">
                            <strong>{notif.title}</strong>
                            <p> {notif.description || notif.text} </p>
                            <span className="notification-time">{notif.time}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="widget-footer">
                <button> Tout marquer comme lu</button>
            </div>
        </div>
    );
};

export default NotificationWidget;