import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage.tsx";
import InfoWidget from "../../components/ui/InfoWidget.tsx";
import InfoBox from "../../components/ui/InfoBox.tsx";
import NotificationService, { Notification } from "../../services/NotificationService.ts";
import { FaRegBell } from "react-icons/fa6";

import "./NotificationPage.css";

export default function NotificationPage() {
	const [notifList, setNotifList] = useState<Notification[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const notifClickHandle = (id: string) => {

	};

	useEffect(() => {
		const getNotifs = async () => {
			try {
				const res = await NotificationService.getUserNotifications();
				setNotifList(res);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		};

		getNotifs();
	}, []);

    return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Mes Notifications</label>
				</div>
			</div>

			<label style={{color: "var(--gray1-col)"}}>Créez et gérez vos propositions de sujet TER.</label>

			{error && <InfoBox label={error} type="error"/>}
			{success && <InfoBox label={success} type="success"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Notifications Non lu" icon={<FaRegBell/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Notifications Lu" icon={<FaRegBell/>} info={0} color="var(--purple-col)"/>
			</div>

			<div className="notif-list">
				{notifList.map((notif, index) => (
					<div key={index} className={`notif-card ${notif.isRead ? 'is-read' : 'is-unread'}`} onClick={() => notifClickHandle(notif.id)}>
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
				))}
			</div>
		</DashboardPage>
    );
}