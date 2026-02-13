import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage.tsx";
import InfoWidget from "../../components/ui/InfoWidget.tsx";
import InfoBox from "../../components/ui/InfoBox.tsx";
import NotificationService, { Notification } from "../../services/NotificationService.ts";
import NotificationWidget from "../../components/objects/NotificationWidget.tsx";
import { FaRegBell } from "react-icons/fa6";

import "./NotificationPage.css";

export default function NotificationPage() {
	const [notifList, setNotifList] = useState<Notification[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const notifLu: number = notifList.filter((notif) => {
		return notif.isRead;
	}).length;

	const notifNonlu: number = notifList.length - notifLu;
	
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
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Mes Notifications</span>
				</div>
			</div>

			<span style={{color: "var(--gray1-col)"}}>Créez et gérez vos propositions de sujet TER.</span>

			{error && <InfoBox label={error} type="error"/>}
			{success && <InfoBox label={success} type="success"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Notifications Lu" icon={<FaRegBell/>} info={notifNonlu} color="var(--blue-col)"/>
				<InfoWidget label="Notifications Non Lu" icon={<FaRegBell/>} info={notifLu} color="var(--purple-col)"/>
			</div>

			<div className="notif-list">
				{notifList.map((notif, index) => (
					<NotificationWidget key={index} notif={notif}/>
				))}
			</div>
		</DashboardPage>
    );
}