import React from "react";
import { Notification } from "../../services/NotificationService";
import "./NotificationWidget.css";

interface NotificationWidgetProps {
	notif: Notification;
	onClick?: () => void;
};

export default function NotificationWidget({notif, onClick}: NotificationWidgetProps){
	return (
		<div className={`notif-card ${notif.isRead ? 'is-read' : 'is-unread'}`} onClick={onClick}>
			<div className="notif-indicator">
				{!notif.isRead && <div className="blue-dot" />}
			</div>
			
			<div className="notif-body">
				<div className="notif-header">
					<span className="notif-title">{notif.title}</span>
					<span className="notif-date">{notif.date}</span>
				</div>
				<p className="notif-text">{notif.message}</p>
			</div>
		</div>
	)
}