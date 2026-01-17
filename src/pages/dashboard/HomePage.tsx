import React from "react";
import DashboardPage from "./DashboardPage.tsx";
import { useAuth } from "../../context/AuthContext.tsx";

import "./HomePage.css"

export default function HomePage(){
    const { user } = useAuth();

    return (
        <DashboardPage>
            <div className="bonjour-div-message">
                <label>Bonjour, {user?.first_name}.</label>
                <label>Bienvenue sur votre tableau de bord où vous pouvez consulter vos différentes expériences.</label>
            </div>
        </DashboardPage>
    )
}