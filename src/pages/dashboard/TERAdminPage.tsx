import React from "react";
import DashboardPage from "./DashboardPage";

import "./TERAdminPage.css"

export default function TERAdminPage(){
	return (
		<DashboardPage>
			<label style={{fontWeight: 800, fontSize: "25px"}}>Gestion TER</label>
			<label>Choose a TER to view detailed information about groups, projects, and professors.</label>
		</DashboardPage>
	)
}