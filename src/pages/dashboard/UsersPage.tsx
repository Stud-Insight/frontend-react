import React from "react";
import DashboardPage from "./DashboardPage";

import "./UsersPage.css"

export default function UsersPage(){
	return (
		<DashboardPage>
			<label style={{fontWeight: 800, fontSize: "25px"}}>Utilisateurs</label>
			<label>Les utilisateurs du site:</label>
		</DashboardPage>	
	)
}