import React from "react";
import DashboardPage from "./DashboardPage";
import "./HelpPage.css";

export default function HelpPage(){
	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Besoin d'aide?</span>
				</div>
			</div>
			<span style={{color: "var(--gray1-col)"}}>Trouvez toutes les réponses aux questions fréquentes pour apprendre à utiliser la plateforme.</span>
		</DashboardPage>
	)
}