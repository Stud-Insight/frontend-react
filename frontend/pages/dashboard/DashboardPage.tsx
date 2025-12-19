import React from "react";
import { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { FaFile } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdLogout } from "react-icons/md";
import { FaBell } from "react-icons/fa";

import NavigationButton from "../../components/nav/NavigationButton.tsx";
import Logo from "../../components/ui/Logo.tsx";
import Divider from "../../components/ui/Divider.tsx";
import UserWidget from "../../components/ui/UserWidget.tsx";
import HorizontalDivider from "../../components/ui/HorizontalDivider.tsx";

import "./DashboardPage.css"

interface DashboardPageInterface {
    children?: React.ReactNode;
};

export default function DashboardPage({children} : DashboardPageInterface){
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [userImage, setUserImage] = useState("");
    const [page, setPage] = useState("users");
    const [perm, setPerm] = useState("etu");
    
    const page_map: Record<string, string> = {
        home: "Home",
        stage: "Stages",
        ter: "TERs",
        notif: "Notifications",
        users: "Utilisateurs",
        archive: "Archives",
        setting: "Paramètres"
    };

    const logout_handle = () => {
        console.log("Deconnection!");
    }

    const page_change_handler = (id: string) => {
        console.log("Page clicked: ", id);
        setPage(id);
    }

    useEffect(() => {
        setUser("Vincent");
        setEmail("vincent.hannah@etu.umontpellier.fr");
        setUserImage("../../assets/default_profile.svg");
    }, []);

    return (
        <div className="dashboard-content">
            {/* side bar */}
            <div className="dashboard-sidebar-content">
                <Logo width={"200"} height={"50"}large={true} className="logo-style-dashboard"/>
                <UserWidget user={user} email={email} perm={perm}/>
                <Divider/>
                <div className="dashboard-group-content">
                    <NavigationButton icon={<FaHome/>} id="home" active={page === "home"} label={page_map["home"]} onClick={(id) => page_change_handler(id)}/>
                    <NavigationButton icon={<IoMail/>} id="stage" active={page === "stage"} label={page_map["stage"]} onClick={(id) => page_change_handler(id)}/>
                    <NavigationButton icon={<FaFile/>} id="ter" active={page === "ter"} label={page_map["ter"]} onClick={(id) => page_change_handler(id)}/>
                    <NavigationButton icon={<FaBell/>} id="notif" active={page === "notif"} label={page_map["notif"]} onClick={(id) => page_change_handler(id)}/>
                </div>
                <Divider/>
                <div className="dashboard-group-content">
                    <NavigationButton icon={<HiUserGroup/>} id="users" active={page === "users"} label={page_map["users"]} onClick={(id) => page_change_handler(id)}/>
                    <NavigationButton icon={<FaBoxArchive/>} id="archive" active={page === "archive"} label={page_map["archive"]} onClick={(id) => page_change_handler(id)}/>
                    <NavigationButton icon={<IoSettingsSharp/>} id="setting" active={page === "setting"} label={page_map["setting"]} onClick={(id) => page_change_handler(id)}/>
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