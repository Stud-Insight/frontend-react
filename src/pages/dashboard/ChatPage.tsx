import React from "react"
import DashboardPage from "./DashboardPage";

import "./ChatPage.css"

export default function ChatPage(){
	return (
		<DashboardPage>
			<label style={{fontWeight: 800, fontSize: "25px"}}>Messages</label>
			<label>Les messages</label>
		</DashboardPage>
	)
}