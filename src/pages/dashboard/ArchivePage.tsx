import React from "react";
import DashboardPage from "./DashboardPage";

import "./ArchivePage.css"

export default function ArchivePage(){
	return (
		<DashboardPage>
			<span style={{fontWeight: 800, fontSize: "25px"}}>Archives</span>
			<span style={{color: "var(--gray1-col)"}}>Les ter archive</span>
		</DashboardPage>
	)
}