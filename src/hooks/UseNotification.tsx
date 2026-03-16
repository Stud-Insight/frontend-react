import React, { useState, useEffect } from "react";
import NotificationService, { Notification } from "../services/NotificationService";

export function useNotification() {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	useEffect(() => {
		let isMounted = true;

		NotificationService.fetchNotifications()
			.then((data) => {
				if (isMounted) {
					setNotifications(data);
				}
			})
			.catch((err) => console.error("Erreur lors du chargement des notifications:", err));


		const unsubscribe = NotificationService.subscribeToNotifications((notification) => {
			setNotifications((prev) => {
				if (prev.some((n) => n.id === notification.id)) {
					return prev;
				}
				return [notification, ...prev];
			});
		});

		return () => {
			isMounted = false;
			unsubscribe();
		};
	}, []);

	return notifications;
}