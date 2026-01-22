import React from "react";
import DashboardPage from "./DashboardPage.tsx";
import SubmitButton from "../../components/input/SubmitButton.tsx";

import "./TERPage.css"
import "./DashboardPage.css"

export default function TERPage(){
    return (
        <DashboardPage>
			<div className="dashboard-content-header-style ">
				<label>TERs</label>
			</div>
        </DashboardPage>
    )
}