import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardPage from "./DashboardPage.tsx";
import InfoBox from "../../components/ui/InfoBox.tsx";
import ContainerWidget from "../../components/ui/ContainerWidget.tsx";
import NotificationService, { Notification, NotificationPreferences, getNotificationRoute } from "../../services/NotificationService.ts";
import NotificationWidget from "../../components/objects/NotificationWidget.tsx";
import EmptyWidget from "../../components/ui/EmptyWidget.tsx";
import Button from "../../atoms/input/Button.tsx";
import { FaRegBell } from "react-icons/fa6";

import "./NotificationPage.css";

const PreferenceLabels: Record<keyof NotificationPreferences, string> = {
	email_messages: "Messages",
	email_assignments: "Affectations",
	email_stages: "Stages",
	email_groups: "Groupes",
};

export default function NotificationPage() {
	const navigate = useNavigate();
	const [notifList, setNotifList] = useState<Notification[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);

	const notifLu = notifList.filter(n => n.is_read).length;
	const notifNonlu = notifList.length - notifLu;

	const notifClickHandle = async (notif: Notification) => {
		try {
			if (!notif.is_read) {
				const updated = await NotificationService.markAsRead(notif.id);
				setNotifList(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true, read_at: updated.read_at } : n));
			}
			const route = NotificationService.getNotificationRoute(notif);
			if (route) {
				navigate(route);
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur";
			setError(message);
		}
	};

	const markAllHandle = async () => {
		try {
			await NotificationService.markAllAsRead();
			setNotifList(prev => prev.map(n => ({ ...n, is_read: true })));
			setSuccess("Toutes les notifications ont ete marquees comme lues.");
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur";
			setError(message);
		}
	};

	const togglePreference = async (key: keyof NotificationPreferences) => {
		if (!preferences) return;
		try {
			const updated = await NotificationService.updatePreferences({ [key]: !preferences[key] });
			setPreferences(updated);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur";
			setError(message);
		}
	};

	useEffect(() => {
		const getNotifs = async () => {
			try {
				const res = await NotificationService.fetchNotifications();
				setNotifList(res);
			} catch (err) {
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		};

		const getPrefs = async () => {
			try {
				const res = await NotificationService.getPreferences();
				setPreferences(res);
			} catch {
				// Preferences may not be available for all users
			}
		};

		getNotifs();
		getPrefs();
	}, []);

	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Mes Notifications</span>
				</div>

				{notifNonlu > 0 &&
					<div className="dashboard-top-button-layout">
						<Button icon={<FaRegBell/>} label="Tout marquer comme lu" onClick={markAllHandle}/>
					</div>
				}
			</div>

			<span style={{color: "var(--gray1-col)"}}>Consultez ici toutes les notifications.</span>

			{error && <InfoBox label={error} type="error"/>}
			{success && <InfoBox label={success} type="success"/>}

			{/* <div className="dashbord-mini-info-layout">
				<InfoWidget label="Non lues" icon={<FaRegBell/>} info={notifNonlu} color="var(--blue-col)"/>
				<InfoWidget label="Lues" icon={<FaRegCheckCircle/>} info={notifLu} color="var(--green-col)"/>
			</div> */}

			{preferences && (
				<ContainerWidget>
					<div className="notif-preferences">
						<span style={{fontWeight: 700, fontSize: "16px"}}>Preferences email</span>
						<span style={{color: "var(--gray1-col)", fontSize: "13px"}}>Choisissez les notifications que vous souhaitez recevoir par email.</span>
						<div className="notif-prefs-grid">
							{(Object.keys(PreferenceLabels) as (keyof NotificationPreferences)[]).map(key => (
								<label key={key} className="notif-pref-item">
									<input
										type="checkbox"
										checked={preferences[key]}
										onChange={() => togglePreference(key)}
									/>
									<span>{PreferenceLabels[key]}</span>
								</label>
							))}
						</div>
					</div>
				</ContainerWidget>
			)}

			{notifList.length > 0 ? (
				<div className="notif-list">
					{notifList.map((notif) => (
						<NotificationWidget key={notif.id} notif={notif} onClick={() => notifClickHandle(notif)}/>
					))}
				</div>
			) : (
				<EmptyWidget icon={<FaRegBell size={30}/>} text="Aucune notification pour le moment."/>
			)}
		</DashboardPage>
	);
}
