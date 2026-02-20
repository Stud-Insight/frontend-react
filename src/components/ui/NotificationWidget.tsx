// src/components/ui/NotificationWidget.tsx
import React from 'react';
import './NotificationWidget.css';

// On définit la structure d'une notification
export interface Notification {
    id: number;
    title: string;
    description: string;
    time: string;
    isRead: boolean; // Le point bleu dépend de ça
}

interface NotificationWidgetProps {
    notifications: Notification[];
    onNotificationClick: (id: number) => void;
    onReadAll: () => void;

}

const NotificationWidget: React.FC<NotificationWidgetProps> = ({ notifications, onNotificationClick, onReadAll }) => {
    return (
        <div className="notification-widget-dropdown">
            <div className="widget-header">
                <h3>Notifications</h3>
            </div>
            <div className="widget-body">
                {notifications.length === 0 ? (
                    <p style={{ padding: '15px', fontSize: '12px' }}>Aucune notification</p>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                            onClick={() => onNotificationClick(notif.id)}
                        >
                            <div className="notification-item-content">
                                <div className="notification-title-row">
                                    <strong>{notif.title}</strong>
                                    {!notif.isRead && <span className="unread-dot"></span>}
                                </div>
                                <p>{notif.description}</p>
                                <span className="notification-time">{notif.time}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className='widget-footer'>
                <button onClick={(e) => {
                    e.stopPropagation();
                    onReadAll();
                }}>
                    Tout marquer comme lu
                </button>
            </div>
        </div>
    );
};

export default NotificationWidget;