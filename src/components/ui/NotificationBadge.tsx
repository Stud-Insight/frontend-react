import React from 'react';
import './NotificationBadge.css';

interface NotificationBadgeProps {
    count: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => {
    if (count <= 0) return null;

    return (
        <div className="notification-badge-container">
            {count > 9 ? '9+' : count}
        </div>
    );
};

export default NotificationBadge;