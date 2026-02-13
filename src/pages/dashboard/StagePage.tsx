import React from "react";
import DashboardPage from "./DashboardPage";
import "./StagePage.css"
import "./DashboardPage.css"

export default function StagePage(){
	return (
		<DashboardPage>
			<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Stages</span>
			<span>Détaile et information sur les stages.</span>
		</DashboardPage>
	)
}