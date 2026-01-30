import React from "react";
import NavigationButton from "../../components/button/NavigationButton.tsx";
import Logo from "../../atoms/ui/Logo.tsx";
import HorizontalDivider from "../../components/ui/HorizontalDivider.tsx";
import VerticalDivider from "../../components/ui/VerticalDivider.tsx";
import UserAvatar from "../../components/ui/UserAvatar.tsx";

import { useState, ReactNode } from "react";
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

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";

import "./DashboardPage.css"

interface DashboardPageProps {
    children?: ReactNode;
};

export default function DashboardPage({children} : DashboardPageProps){
    const { user } = useAuth();
	const { logout } = useAuth();

    const { pathname } = useLocation();
    const navigate = useNavigate();

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

    return (
        <div className="dashboard-content">
			<div className="dashboard-sidebar-layout">
				<div className="dashboard-sidebar-content">
					{/* <Logo width="auto" large={true}/> */}
					<NavigationButton label="Accueil" active={pathname.startsWith("/dashboard/home")} icon={<FiHome/>} id="home" onClick={(id) => pageHandle(id)}/>
					<NavigationButton label="TER" active={pathname.startsWith("/dashboard/ter/select")} icon={<TbSchool/>} id="ter/select" onClick={(id) => pageHandle(id)}/>
					<NavigationButton label="Stages" active={pathname.startsWith("/dashboard/stages")} icon={<MdWorkOutline/>} id="stages" onClick={(id) => pageHandle(id)}/>
					<NavigationButton label="Messages" active={pathname.startsWith("/dashboard/chat")} icon={<LuMessageSquare/>} id="chat" onClick={(id) => pageHandle(id)}/>
					<NavigationButton label="Calendrier" active={pathname.startsWith("/dashboard/calender")} icon={<HiOutlineCalendar/>} id="calender" onClick={(id) => pageHandle(id)}/>
					<HorizontalDivider/>
					
					<>
						<NavigationButton label="Mes Projets" active={pathname.startsWith("/dashboard/projets")} icon={<FaRegFolder/>} id="projets" onClick={(id) => pageHandle(id)}/>
						<NavigationButton label="Gestion TERs" active={pathname.startsWith("/dashboard/ter")} icon={<AiOutlineAppstore size={25}/>} id="ter/list" onClick={(id) => pageHandle(id)}/>
						<NavigationButton label="Gestion Utilisateurs" active={pathname.startsWith("/dashboard/users")} icon={<FiUsers/>} id="users" onClick={(id) => pageHandle(id)}/>
						<NavigationButton label="Archives" active={pathname.startsWith("/dashboard/archive")} icon={<FiArchive/>} id="archive" onClick={(id) => pageHandle(id)}/>
						<HorizontalDivider/>
					</>
				</div>

				<div className="dashboard-sidebar-content">
					<HorizontalDivider/>
					<NavigationButton icon={<MdLogout/>} label="Déconnexion" onClick={logoutHandle}/>
				</div>
			</div>

			<VerticalDivider/>

            <div className="dashboard-rightside-main">
				<div className="dashboard-header-container">
					{/* <MdNotificationsNone size={20}/> */}

					<div className="dashboard-user-container">
						<label>{user?.first_name} {user?.last_name}</label>
						<div className="dashboard-avatar-container">
							<UserAvatar user={user}/>
						</div>
					</div>
				</div>

				<HorizontalDivider/>
				
                <div className="dashboard-main-container">
                    {children}
                </div>
            </div>
        </div>
    )
}