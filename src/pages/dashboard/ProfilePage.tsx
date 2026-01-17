import React from "react";
import DashboardPage from "./DashboardPage.tsx";
import { useAuth } from "../../context/AuthContext.tsx";

import "./HomePage.css"

export default function ProfilePage(){
    const { user } = useAuth();

    return (
        <DashboardPage>
            <label> Profile </label>
        </DashboardPage>
    );
}