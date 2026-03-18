import React from "react";
import { Notification } from "../../services/NotificationService";
import "./NotificationWidget.css";

interface NotificationWidgetProps {
	notif: Notification;
	onClick?: () => void;
};

function formatDate(isoDate: string): string {
	const d = new Date(isoDate);
	return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function NotificationWidget({notif, onClick}: NotificationWidgetProps){
	return (
		<div className={`notif-card ${notif.is_read ? 'is-read' : 'is-unread'}`} onClick={onClick}>
			<div className="notif-indicator">
				{!notif.is_read && <div className="blue-dot" />}
			</div>

			<div className="notif-body">
				<div className="notif-header">
					<span className="notif-title">{notif.title}</span>
					<span className="notif-date">{formatDate(notif.created)}</span>
				</div>
				<p className="notif-text">{notif.message}</p>
			</div>
		</div>
	)
}
