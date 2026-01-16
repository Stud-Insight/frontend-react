import React from "react";
import { useState, useEffect } from "react";
import { FaHome, FaFile, FaBell, FaFolder, FaComments } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";
import { IoMail, IoSettingsSharp } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import NavigationButton from "../../components/nav/NavigationButton.tsx";
import Logo from "../../components/ui/Logo.tsx";
import Divider from "../../components/ui/Divider.tsx";
import UserWidget from "../../components/ui/UserWidget.tsx";
import HorizontalDivider from "../../components/ui/HorizontalDivider.tsx";
import UserService, { User } from "../../services/UserService.ts"
import { useAuth } from "../../context/AuthContext.tsx";

import "./DashboardPage.css"

interface DashboardPageInterface {
    children?: React.ReactNode;
};

export default function DashboardPage({children} : DashboardPageInterface){
    const [user, setUser] = useState<User | null>(null);
    const [userImage, setUserImage] = useState("");
    const [page, setPage] = useState("home");
    const [perm, setPerm] = useState("etu");
    
    const navigate = useNavigate();
    const { logout } = useAuth();

    const page_map: Record<string, string> = {
        home: "Home",
        stage: "Stages",
        ter: "TERs",
        files: "Fichiers",
        chat: "Messages",
        notification: "Notifications",
        users: "Utilisateurs",
        archive: "Archives",
        settings: "Paramètres"
    };

    const logout_handle = async () => {
        try {
            await logout();
            setUser(null);
            navigate("/");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur de connexion";
        }
    }

    const page_change_handler = (id: string) => {
        console.log("Page clicked: ", id);
        setPage(id);
        navigate("/dashboard/" + id);
    }

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await UserService.getCurrentUser();
            setUser(currentUser);
        };

        loadUser();

        // const test_user: User = {
        //     id: "1",
        //     email: "test@example.com",
        //     first_name: "Vincent",
        //     last_name: "Hannah",
        //     groups: [],
        //     is_staff: false,
        //     is_superuser: false,
        // };
        // setUser(test_user);

    }, []);

    return (
        <div className="dashboard-content">
            {/* side bar */}
            <div className="dashboard-sidebar-content">
                <Logo width={"200"} height={"50"} large={true} className="logo-style-dashboard"/>
                <UserWidget user={user}/>
                <Divider/>
                <div className="dashboard-group-content">
                    <NavigationButton icon={<FaHome/>} id="home" active={page === "home"} label={page_map["home"]} onClick={(id) => page_change_handler(id)}/>
                    <NavigationButton icon={<IoMail/>} id="stage" active={page === "stage"} label={page_map["stage"]} onClick={(id) => page_change_handler(id)}/>
                    <NavigationButton icon={<FaFile/>} id="ter" active={page === "ter"} label={page_map["ter"]} onClick={(id) => page_change_handler(id)}/>
                    <NavigationButton icon={<FaFolder/>} id="files" active={page === "files"} label={page_map["files"]} onClick={(id) => page_change_handler(id)}/>
                    <NavigationButton icon={<FaComments/>} id="chat" active={page === "chat"} label={page_map["chat"]} onClick={(id) => page_change_handler(id)}/>
                    <NavigationButton icon={<FaBell/>} id="notification" active={page === "notification"} label={page_map["notification"]} onClick={(id) => page_change_handler(id)}/>
                </div>
                <Divider/>
                <div className="dashboard-group-content">
                    <NavigationButton icon={<HiUserGroup/>} id="users" active={page === "users"} label={page_map["users"]} onClick={(id) => page_change_handler(id)}/>
                    <NavigationButton icon={<FaBoxArchive/>} id="archive" active={page === "archive"} label={page_map["archive"]} onClick={(id) => page_change_handler(id)}/>
                    <NavigationButton icon={<IoSettingsSharp/>} id="settings" active={page === "settings"} label={page_map["settings"]} onClick={(id) => page_change_handler(id)}/>
                </div>
                <Divider/>
                <NavigationButton icon={<MdLogout/>} label="Déconnection" onClick={logout_handle}/>
            </div>

            {/* dashboard */}
             <div className="dashboard-rightside-main">
                <div className="dashboard-main-content">
                    <label>{page_map[page]}</label>
                    {children}
                </div>
            </div>
        </div>
    )
}