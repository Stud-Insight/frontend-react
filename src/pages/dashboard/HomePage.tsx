import React, { useState, useEffect } from "react";
import RespoDashboard from "./RespoDashboard";
import StudentDashboard from "./StudentDashboard";
import DashboardPage from "./DashboardPage";

import "./HomePage.css";

export default function HomePage() {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulation de l'appel API (Story 12.9)
        const fetchRole = async () => {
            await new Promise(r => setTimeout(r, 500));
            setRole("RESPO_TER"); // Change ici en "STUDENT" pour tester l'autre vue
            setLoading(false);
        };
        fetchRole();
    }, []);

    if (loading) return <div className="loading-screen"><div className="loader"></div></div>;

    return (
		<DashboardPage>
			<div className="dashboard-container">
				{role === "RESPO_TER" ? <RespoDashboard /> : <StudentDashboard />}
			</div>
		</DashboardPage>
    );
}