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
    const [page, setPage] = useState("users");
    
    const navigate = useNavigate();
    const { logout } = useAuth();

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
        // const loadUser = async () => {
        //     const currentUser = await UserService.getCurrentUser();
        //     setUser(currentUser);
        // };

        // loadUser();

        const test_user: User = {
            id: "1",
            email: "test@example.com",
            first_name: "Clémentine",
            last_name: "Nébut",
            groups: [],
            is_staff: false,
            is_superuser: false,
        };
        setUser(test_user);

    }, []);

    return (
        <div className="dashboard-content">
            <div className="dashboard-sidebar-content">
                <Logo width={"200"} height={"50"} large={true} className="logo-style-dashboard"/>
                <Divider/>
                <UserWidget user={user}/>
                <Divider/>

                <NavigationButton label={"Accueil"} active={page == "home"} icon={<FaHome/>} id="home" onClick={(id) => page_change_handler(id)}/>
                <NavigationButton label={"Stages"} active={page == "stage"} icon={<IoMail/>} id="stage" onClick={(id) => page_change_handler(id)}/>
                <NavigationButton label={"TERs"} active={page == "ter"} icon={<FaFile/>} id="ter" onClick={(id) => page_change_handler(id)}/>
                <NavigationButton label={"Fichiers"} active={page == "files"} icon={<FaFolder/>} id="files" onClick={(id) => page_change_handler(id)}/>
                <NavigationButton label={"Messages"} active={page == "chat"} icon={<FaComments/>} id="chat" onClick={(id) => page_change_handler(id)}/>

                <Divider/>

                <NavigationButton label={"Utilisateurs"} active={page == "users"} icon={<HiUserGroup/>} id="users" onClick={(id) => page_change_handler(id)}/>
                <NavigationButton label={"Archives"} active={page == "archive"} icon={<FaBoxArchive/>} id="archive" onClick={(id) => page_change_handler(id)}/>
                {/* <NavigationButton icon={<IoSettingsSharp/>} id="settings" onClick={(id) => page_change_handler(id)}/> */}

                <Divider/>
                <NavigationButton icon={<MdLogout/>} label="Déconnection" onClick={logout_handle}/>
            </div>

            <HorizontalDivider/>

             <div className="dashboard-rightside-main">
                <div className="dashboard-main-content">
                    {children}
                </div>
            </div>
        </div>
    )
}