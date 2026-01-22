import React from "react";
import DashboardPage from "./DashboardPage";
import SubmitButton from "../../components/input/SubmitButton";
import HorizontalDivider from "../../components/ui/HorizontalDivider.tsx";
import "./GestionTERPage.css"
import "./DashboardPage"

export default function GestionTERPage(){
	return (
		<DashboardPage>
			<div className="dashboard-content-header-style ">
				<label>Gestion TER</label>
				<div>
					<SubmitButton label="Créer un TER"/>
				</div>
			</div>
			<HorizontalDivider/>

		</DashboardPage>
	)
}