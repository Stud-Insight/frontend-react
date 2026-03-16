import React, { useState, ReactNode, useRef, useEffect } from "react";
import NavigationButton from "../../components/button/NavigationButton.tsx";
import Logo from "../../atoms/ui/Logo.tsx";
import HorizontalDivider from "../../components/ui/HorizontalDivider.tsx";
import VerticalDivider from "../../components/ui/VerticalDivider.tsx";
import UserAvatar from "../../components/ui/UserAvatar.tsx";

import { FiArchive } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { AiOutlineAppstore } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FaRegFolder } from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";
import { TbSchool } from "react-icons/tb";
import { MdWorkOutline } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import { User, UserRoles } from "../../services/UserService.ts";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import { PiQuestionBold } from "react-icons/pi";

import NotificationService, { Notification } from "../../services/NotificationService.ts";
import "./DashboardPage.css"

interface DashboardPageProps {
	children?: ReactNode;
};

export default function DashboardPage({ children }: DashboardPageProps) {
	const { user } = useAuth();
	const { logout } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();

	const notificationRef = useRef<HTMLDivElement>(null);
	const [showNotifications, setShowNotifications] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const unreadCount = notifications.filter(n => !n.isRead).length;

	const roles: UserRoles[] = user == null ? [] : user?.groups.map(role => {
		return role.name;
	});

	const notification_map: Map<string, number> = new Map([
		["home", 0],
		["ter", 0],
		["stages", 0],
		["chat", 0],
		["notification", unreadCount],
		["sujets", 0],
		["archive", 0],
	]);

    const logoutHandle = async () => {
        try {
            await logout();
            navigate("/");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur de connexion";
        }
    }

    const pageHandle = (id: string) => {
        navigate("/dashboard/" + id);
    }

	const isActive = (pattern: string) => {
		return matchPath({ path: pattern, end: false }, pathname) !== null;
	};

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
			console.log("Notification reçue SSE :", notification);
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
					<Logo large={true}/>
					<HorizontalDivider/>
					<NavigationButton label="Accueil" active={isActive("/dashboard/home")} icon={<FiHome/>} id="home" onClick={pageHandle} notifCount={notification_map.get("home")}/>
					<NavigationButton label="TER" active={ isActive("/dashboard/ter/*") && !isActive("/dashboard/ter/:id/admin") && !isActive("/dashboard/ter/list")} icon={<TbSchool/>} id="ter" onClick={pageHandle} notifCount={notification_map.get("ter")}/>
					<NavigationButton label="Stages" active={isActive("/dashboard/stages")} icon={<MdWorkOutline/>} id="stages" onClick={pageHandle} notifCount={notification_map.get("stages")}/>
					<NavigationButton label="Conversations" active={isActive("/dashboard/chat")} icon={<LuMessageSquare/>} id="chat" onClick={pageHandle} notifCount={notification_map.get("chat")}/>
					<NavigationButton label="Notifications" active={isActive("/dashboard/notification")} icon={<FaRegBell/>} id="notification" onClick={pageHandle} notifCount={notification_map.get("notification")}/>
					<HorizontalDivider/>

					{(roles.includes(UserRoles.ENCADRANT) || roles.includes(UserRoles.ADMIN)) && 
						<NavigationButton label="Sujets TER" active={isActive("/dashboard/subjects")} icon={<FaRegFolder/>} id="subjects" onClick={pageHandle} notifCount={notification_map.get("sujets")}/>
					}

					{(roles.includes(UserRoles.RESPO_STAGE) || roles.includes(UserRoles.RESPO_TER) || roles.includes(UserRoles.ADMIN)) && 
						<NavigationButton label="Gestion TER" active={isActive("/dashboard/ter/:id/admin") || isActive("/dashboard/ter/list")} icon={<AiOutlineAppstore size={25}/>} id="ter/list" onClick={pageHandle}/>
					}
					
					{roles.includes(UserRoles.ADMIN) &&
						<NavigationButton label="Gestion Utilisateurs" active={isActive("/dashboard/users")} icon={<FiUsers/>} id="users" onClick={pageHandle}/>
					}	

					{!roles.includes(UserRoles.ETUDIANT) &&
						<>
							<NavigationButton label="Archives" active={isActive("/dashboard/archive")} icon={<FiArchive/>} id="archive" onClick={pageHandle} notifCount={notification_map.get("archive")}/>
							<HorizontalDivider/>
						</>				
					}
					
					<NavigationButton label="Aide" icon={<PiQuestionBold/>} id="help" active={isActive("/dashboard/help")}  onClick={pageHandle}/>
				</div>

				<div className="dashboard-sidebar-content">
					<HorizontalDivider/>
					<NavigationButton className="dashboard-profile-wrapper" label="Profil" active={isActive("/dashboard/profile/*")} icon={<FiUser/>} id="profile/me" onClick={pageHandle}>
						<UserAvatar user={user} size={50}/>
						<div className="dashboard-profile-text">
							<span style={{color: "var(--black-col)"}}>{user?.first_name} {user?.last_name}</span>
							<span style={{color: "var(--gray1-col)", fontSize: "12px"}}>{user?.email}</span>
						</div>
					</NavigationButton>
					<HorizontalDivider/>
					<NavigationButton icon={<MdLogout/>} label="Déconnexion" onClick={logoutHandle}/>
				</div>
			</div>

			<VerticalDivider />

			<div className="dashboard-rightside-main">
				<div className="dashboard-header-container"/>
				<HorizontalDivider/>
                <div className="dashboard-main-container">
                    {children}
                </div>
            </div>
		</div>
	)
}