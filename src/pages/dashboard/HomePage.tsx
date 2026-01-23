import React from "react";
import DashboardPage from "./DashboardPage";
import { useAuth } from "../../context/AuthContext.tsx";

import "./HomePage.css"

export default function HomePage(){
	const { user } = useAuth();

	return (
		<DashboardPage>
			<label style={{fontWeight: 800, fontSize: "25px"}}>Bonjour, {user?.first_name}!</label>
		</DashboardPage>
	)
}