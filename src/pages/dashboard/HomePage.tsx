import React from "react";
import DashboardPage from "./DashboardPage";
import { useAuth } from "../../context/AuthContext.tsx";

import "./HomePage.css"

export default function HomePage(){
	const { user } = useAuth();

	return (
		<DashboardPage>
			<div>
				<h2>Welcome back, {user?.first_name}!</h2>
				Here's what's happening with your TER project
			</div>
		</DashboardPage>
	)
}