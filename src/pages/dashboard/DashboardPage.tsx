import React, { useState, ReactNode, useRef, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import axios from "axios";

import NavigationButton from "../../components/button/NavigationButton.tsx";
import Logo from "../../atoms/ui/Logo.tsx";
import HorizontalDivider from "../../components/ui/HorizontalDivider.tsx";
import VerticalDivider from "../../components/ui/VerticalDivider.tsx";
import UserAvatar from "../../components/ui/UserAvatar.tsx";
import NotificationBadge from "../../components/ui/NotificationBadge.tsx";
import NotificationWidget, { Notification } from "../../components/ui/NotificationWidget.tsx";


import { FiArchive } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { AiOutlineAppstore } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FaRegFolder } from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";
import { TbSchool } from "react-icons/tb";
import { HiOutlineCalendar } from "react-icons/hi";
import { MdWorkOutline } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md"


import { useAuth } from "../../context/AuthContext.tsx";
import { subscribeToNotifications } from "../../services/NotificationService.ts";


import "./DashboardPage.css"

const API_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:8000";

interface DashboardPageProps {
	children?: ReactNode;
};

export default function DashboardPage({ children }: DashboardPageProps) {
	const notificationRef = useRef<HTMLDivElement>(null);
	const [showNotifications, setShowNotifications] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const unreadCount = notifications.filter(n => !n.isRead).length;

	const { user } = useAuth();
	const { logout } = useAuth();

	const { pathname } = useLocation();
	const navigate = useNavigate();

	const logoutHandle = async () => {
		try {
			await logout();
			navigate("/");
		} catch (err) {
			console.error("Erreur markAllAsRead:", err);
		}
	}

	const pageHandle = (id: string) => {
		navigate("/dashboard/" + id);
	}

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
				setShowNotifications(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const response = await axios.get(`${API_URL}/api/notifications/history/`, {
					withCredentials: true
				});
				setNotifications(response.data);
			} catch (err) {
				console.error("Erreur lors du chargement de l'historique", err);
			}
		};
		fetchHistory();
	}, []);

	useEffect(() => {
		const unsubscribe = subscribeToNotifications((newNotif) => {
			setNotifications(prevNotifications => [newNotif, ...prevNotifications]);
		});
		return () => unsubscribe();
	}, []);

	const markAsRead = async (id: number) => {
		try {
			await axios.patch(`${API_URL}/api/notifications/${id}/read/`, {}, { withCredentials: true });
			setNotifications(prevNotifications => prevNotifications.map(n => n.id === id ? { ...n, isRead: true } : n));
		} catch (err) {
			console.error("Erreur markAsRead:", err);
		}
	}

	const markAllAsRead = async () => {
		try {
			await axios.post(`${API_URL}/api/notifications/mark-all-read/`, {}, { withCredentials: true });
			setNotifications(prevNotifications => prevNotifications.map(n => ({ ...n, isRead: true })));
		} catch (err) {
			console.error("Erreur markAllAsRead:", err);
		}
	};


	return (
		<div className="dashboard-content">
			<div className="dashboard-sidebar-layout">
				<div className="dashboard-sidebar-content">
					<Logo width="auto" large={true} />
					<HorizontalDivider />
					<NavigationButton label="Accueil" active={pathname.startsWith("/dashboard/home")} icon={<FiHome />} id="home" onClick={(id) => pageHandle(id)} />
					<NavigationButton label="TER" active={pathname.startsWith("/dashboard/ter/select")} icon={<TbSchool />} id="ter/select" onClick={(id) => pageHandle(id)} />
					<NavigationButton label="Stages" active={pathname.startsWith("/dashboard/stages")} icon={<MdWorkOutline />} id="stages" onClick={(id) => pageHandle(id)} />
					<NavigationButton label="Messages" active={pathname.startsWith("/dashboard/chat")} icon={<LuMessageSquare />} id="chat" onClick={(id) => pageHandle(id)} />
					<NavigationButton label="Calendrier" active={pathname.startsWith("/dashboard/calender")} icon={<HiOutlineCalendar />} id="calender" onClick={(id) => pageHandle(id)} />
					<HorizontalDivider />
					<NavigationButton label="Mes Sujets" active={pathname.startsWith("/dashboard/subjects")} icon={<FaRegFolder />} id="subjects" onClick={(id) => pageHandle(id)} />
					<NavigationButton label="Gestion TER" active={pathname.startsWith("/dashboard/ter")} icon={<AiOutlineAppstore size={25} />} id="ter/list" onClick={(id) => pageHandle(id)} />
					<NavigationButton label="Gestion Utilisateurs" active={pathname.startsWith("/dashboard/users")} icon={<FiUsers />} id="users" onClick={(id) => pageHandle(id)} />
					<NavigationButton label="Archives" active={pathname.startsWith("/dashboard/archive")} icon={<FiArchive />} id="archive" onClick={(id) => pageHandle(id)} />
					<HorizontalDivider />
				</div>

				<div className="dashboard-sidebar-content">
					<HorizontalDivider />
					<NavigationButton icon={<MdLogout />} label="Déconnexion" onClick={logoutHandle} />
				</div>
			</div>

			<VerticalDivider />

			<div className="dashboard-rightside-main">
				<div className="dashboard-header-container">
					{/* <MdNotificationsNone size={20}/> */}
					<div
						ref={notificationRef}
						style={{ position: 'relative', cursor: 'pointer', marginRight: '20px' }}>
						<div onClick={() => {
							setShowNotifications(!showNotifications);
						}}>
							<MdNotificationsNone size={25} color="#555" />
							<NotificationBadge count={unreadCount} />
						</div>
						{showNotifications && <NotificationWidget notifications={notifications} onNotificationClick={markAsRead} onReadAll={markAllAsRead} />}
					</div>

					<div className="dashboard-user-container">
						<label>{user?.first_name} {user?.last_name}</label>
						<div className="dashboard-avatar-container">
							<UserAvatar user={user} />
						</div>
					</div>
				</div>

				<HorizontalDivider />

				<div className="dashboard-main-container">
					<Outlet />
				</div>
			</div>
		</div>
	)
}