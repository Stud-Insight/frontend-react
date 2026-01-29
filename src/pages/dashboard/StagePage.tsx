import React from "react";
import DashboardPage from "./DashboardPage";
import "./StagePage.css"
import "./DashboardPage.css"

export default function StagePage(){
	return (
		<DashboardPage>
			<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Stages</label>
			<label>Détaile et information sur les stages.</label>
		</DashboardPage>
	)
}