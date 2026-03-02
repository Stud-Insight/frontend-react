import React, { useState, ReactNode, useRef, useEffect } from "react";
import { useNavigate, useLocation, Outlet, data } from "react-router-dom";

import NavigationButton from "../../components/button/NavigationButton.tsx";
import Logo from "../../atoms/ui/Logo.tsx";
import HorizontalDivider from "../../components/ui/HorizontalDivider.tsx";
import VerticalDivider from "../../components/ui/VerticalDivider.tsx";
import UserAvatar from "../../components/ui/UserAvatar.tsx";
import NotificationBadge from "../../components/ui/NotificationBadge.tsx";
import NotificationWidget from "../../components/ui/NotificationWidget.tsx";
import RespoDashboard from "./RespoDashboard.tsx";


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
import NotificationService, { Notification } from "../../services/NotificationService.ts";

import "./DashboardPage.css"

interface DashboardPageProps {
	children?: ReactNode;
};

export default function DashboardPage({ children }: DashboardPageProps) {
	const notificationRef = useRef<HTMLDivElement>(null);
	const [showNotifications, setShowNotifications] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const unreadCount = notifications.filter(n => !n.isRead).length;

	const { user } = useAuth();
	//const user = { first_name: "Maida", last_name: "Test" }; //Juste en attendant pour me connecter 
	const { logout } = useAuth();
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const logoutHandle = async () => {
		try {
			await logout();
			navigate("/");
		} catch (err) {
			console.error("Erreur déconnexion:", err);
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
					<div ref={notificationRef} style={{ position: 'relative', cursor: 'pointer', marginRight: '20px' }}>
						<div onClick={() => setShowNotifications(!showNotifications)}>
							<MdNotificationsNone size={25} color="#555" />
							<NotificationBadge count={unreadCount} />
						</div>
						{showNotifications && (
							<NotificationWidget
								notifications={notifications}
								onNotificationClick={(id) => {
									NotificationService.markAsRead(id);
									setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
								}}
								onReadAll={() => {
									NotificationService.markAllAsRead();
									setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
								}}
							/>
						)}
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
					{pathname === "/dashboard" || pathname === "/dashboard" || pathname === "/dashboard/home" ? (
						<RespoDashboard />
					) : (
						<Outlet />
					)}
				</div>
			</div>
		</div>
	)
}