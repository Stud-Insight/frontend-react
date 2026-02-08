import React, { useState, useEffect } from "react";
import { FaHome, FaFile, FaBell } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";
import { IoMail, IoSettingsSharp } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import { MdLogout } from "react-icons/md";
import Toast from "../../components/ui/Toast.tsx";
import { useNavigate, Outlet } from "react-router-dom"; 
import { NotificationService } from "../../service/NotificationService";
import NavigationButton from "../../components/nav/NavigationButton.tsx";
import Logo from "../../components/ui/Logo.tsx";
import Divider from "../../components/ui/Divider.tsx";
import UserWidget from "../../components/ui/UserWidget.tsx";

import "./DashboardPage.css"

type UserPermission = "etu" | "prof" | "admin" | "extern";

export default function DashboardPage() {
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [perm, setPerm] = useState<UserPermission>("etu");
    const [page, setPage] = useState("home");
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    const page_map: Record<string, string> = {
        home: "Accueil",
        stage: "Stages",
        ter: "TERs",
        notification: "Notifications",
        users: "Utilisateurs",
        archive: "Archives",
        settings: "Paramètres"
    };

    const logout_handle = () => {
        navigate("/auth/login");
    }

    const page_change_handler = (id: string) => {
        setPage(id);
        navigate("/dashboard/" + id);
    }

    useEffect(() => {
        setUser("Vincent");
        setEmail("vincent.hannah@etu.umontpellier.fr");
        setPerm("etu");

        NotificationService.getHistory().then(Notifications => {
            const unread = Notifications.filter(n =>!n.isRead).length;
            setUnreadCount(unread);
        });

        NotificationService.connect((count) =>{
            setUnreadCount(count);
            if (count >0) {
                setToastMessage("Vous avez reçu une nouvelle notification !");
            }
        });

        return () => NotificationService.disconnect();
    }, []);

    return (
        <div className="dashboard-content">
            {/* Barre latérale (Sidebar) */}
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}
            <div className="dashboard-sidebar-content">
                <Logo width={"200"} height={"50"} large={true} className="logo-style-dashboard"/>
                <UserWidget user={user} email={email} perm={perm}/>
                <Divider/>
                <div className="dashboard-group-content">
                    <NavigationButton icon={<FaHome/>} id="home" active={page === "home"} label={page_map["home"]} onClick={page_change_handler}/>
                    <NavigationButton icon={<IoMail/>} id="stage" active={page === "stage"} label={page_map["stage"]} onClick={page_change_handler}/>
                    <NavigationButton icon={<FaFile/>} id="ter" active={page === "ter"} label={page_map["ter"]} onClick={page_change_handler}/>
                    <NavigationButton icon={<FaBell/>} id="notification" active={page === "notification"} label={page_map["notification"]} onClick={page_change_handler} unreadCount={unreadCount}/>
                </div>
                <Divider/>
                <div className="dashboard-group-content">
                    <NavigationButton icon={<HiUserGroup/>} id="users" active={page === "users"} label={page_map["users"]} onClick={page_change_handler}/>
                    <NavigationButton icon={<FaBoxArchive/>} id="archive" active={page === "archive"} label={page_map["archive"]} onClick={page_change_handler}/>
                    <NavigationButton icon={<IoSettingsSharp/>} id="settings" active={page === "settings"} label={page_map["settings"]} onClick={page_change_handler}/>
                </div>
                <Divider/>
                <NavigationButton icon={<MdLogout/>} label="Déconnexion" onClick={logout_handle}/>
            </div>

            {/* Contenu principal (Main) */}
            <div className="dashboard-rightside-main">
                <div className="dashboard-main-content">
                    <label style={{display: 'block', marginBottom: '20px'}}>{page_map[page]}</label>
                    
                    {/* LE CONTENU DE VOS PAGES (HOME, NOTIFICATIONS, ETC.) APPARAÎTRA ICI */}
                    <Outlet />
                </div>
            </div>
        </div>
    )
}