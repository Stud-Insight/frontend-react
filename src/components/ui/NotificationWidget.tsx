
import React from 'react';
import { Notification } from '../../services/NotificationService';
import './NotificationWidget.css';

interface NotificationWidgetProps {
    notifications: Notification[];
    onNotificationClick: (id: number) => void;
    onReadAll: () => void;
}

export default function NotificationWidget({ notifications, onNotificationClick, onReadAll }: NotificationWidgetProps) {
    return (
        <div className='notification-widget'>
            <div className='notification-header'>
                <h3>Notifications</h3>
                {notifications.length > 0 && (<button onClick={onReadAll} className='read-all-btn'> Tout marquer comme lu </button>)}
            </div>

            <div className='notification-list'>
                {notifications.length === 0 ? (
                    <div className='empty-msg'>
                        Aucune notification pour le moment.
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`notification-item ${!n.isRead ? "unread" : ""}`} onClick={() => onNotificationClick(n.id)}
                        >
                            <div className='notif-content'>
                                <strong>{n.title}</strong>
                                <p>{n.message}</p>
                                <span className='notif-date'>{n.created_at}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}