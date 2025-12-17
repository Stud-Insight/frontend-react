import React from "react";
import { useState, useEffect } from "react";
import NavigationButton from "../../components/nav/NavigationButton.tsx";
import Logo from "../../components/ui/Logo.tsx";
import Divider from "../../components/ui/Divider.tsx";
import UserWidget from "../../components/ui/UserWidget.tsx";
import { FaHome } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { FaFile } from "react-icons/fa";

import "./DashboardPage.css"

export default function DashboardPage(){
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [userImage, setUserImage] = useState("");

    useEffect(() => {
        setUser("Vincent");
        setEmail("vincent.hannah@etu.umontpellier.fr");
        setUserImage("../../assets/default_profile.svg");
    }, []);

    return (
        <div className="dashboard-content">
            <div className="dashboard-sidebar-content">
                {/* <Logo width={"350"} height={"100"}large={true} className="logo-style-dashboard"/> */}
                <NavigationButton icon={<FaHome/>} label="Accueil"/>
                <NavigationButton icon={<IoMail/>} label="Stages"/>
                <NavigationButton icon={<FaFile/>} label="TERs"/>
                <NavigationButton icon={<FaBookOpen/>} label="Archives"/>
                <NavigationButton icon={<IoSettingsSharp/>} label="Paramètres"/>
                <Divider/>
                <UserWidget user={user} email={email}/>
            </div>
            
            <div className="dashboard-main-content">

            </div>
        </div>
    )
}