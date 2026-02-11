import React, { useState, useEffect } from "react";
import RespoDashboard from "./RespoDashboard";
import StudentDashboard from "./StudentDashboard";
import DashboardPage from "./DashboardPage";

import "./HomePage.css";

export default function HomePage() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchRole = async () => {
            await new Promise(r => setTimeout(r, 500));
            setRole("RESPO_TER");
        };
        fetchRole();
    }, []);

    return (
		<DashboardPage>
			<div className="dashboard-container">
				{role === "RESPO_TER" ? <RespoDashboard /> : <StudentDashboard />}
			</div>
		</DashboardPage>
    );
}