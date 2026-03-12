import React from 'react';
import './NotificationBadge.css';

interface NotificationBadgeProps {
    count: number;
}

export default function NotificationBadge({count}: NotificationBadgeProps) {
    if (count <= 0) return null;

    return (
        <div className="notification-badge-container">
            {count > 9 ? '9+' : count}
        </div>
    );
};