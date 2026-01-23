import React from "react";
import NavigationButton from "../../components/nav/NavigationButton.tsx";
import Logo from "../../components/ui/Logo.tsx";
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

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";

import "./DashboardPage.css"

interface DashboardPageProps {
    children?: ReactNode;
};

export default function DashboardPage({children} : DashboardPageProps){
    const { user } = useAuth();
	const { logout } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();
    const currentPage = location.pathname.split("/").pop();

    const logout_handle = async () => {
        try {
            await logout();
            navigate("/");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur de connexion";
        }
    }

    const page_change_handler = (id: string) => {
        navigate("/dashboard/" + id);
    }

    return (
        <div className="dashboard-content">
			<div className="dashboard-sidebar-layout">
				<div className="dashboard-sidebar-content">

					<NavigationButton label="Accueil" active={currentPage == "home"} icon={<FiHome/>} id="home" onClick={(id) => page_change_handler(id)}/>
					<NavigationButton label="TER" active={currentPage == "ter"} icon={<TbSchool/>} id="ter" onClick={(id) => page_change_handler(id)}/>
					<NavigationButton label="Messages" active={currentPage == "chat"} icon={<LuMessageSquare/>} id="chat" onClick={(id) => page_change_handler(id)}/>
					<NavigationButton label="Mes Projets" active={currentPage == "projets"} icon={<FaRegFolder/>} id="projets" onClick={(id) => page_change_handler(id)}/>
					<NavigationButton label="Calendrier" active={currentPage == "calender"} icon={<HiOutlineCalendar/>} id="calender" onClick={(id) => page_change_handler(id)}/>

					{user?.is_superuser && 
						<>
							<HorizontalDivider/>
							<NavigationButton label="Gestion TER" active={currentPage == "admin_ter"} icon={<AiOutlineAppstore size={25}/>} id="admin_ter" onClick={(id) => page_change_handler(id)}/>
							<NavigationButton label="Utilisateurs" active={currentPage == "users"} icon={<FiUsers/>} id="users" onClick={(id) => page_change_handler(id)}/>
							<NavigationButton label="Archives" active={currentPage == "archive"} icon={<FiArchive/>} id="archive" onClick={(id) => page_change_handler(id)}/>
							<HorizontalDivider/>
						</>
					}
				</div>

				<div className="dashboard-sidebar-content">
					<HorizontalDivider/>
					<NavigationButton icon={<MdLogout/>} label="Déconnexion" onClick={logout_handle}/>
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