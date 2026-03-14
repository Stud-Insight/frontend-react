import React from 'react';
import DashboardPage from "../DashboardPage.tsx";
import { useAuth } from "../../../hooks/AuthContext.tsx";
import { UserRoles } from "../../../services/UserService.ts";
import StudentHomePage from './StudentHomePage.tsx';
import RespoDashboard from './RespoDashboard.tsx';
import EncadrantDashboard from './EncadrantDashboard.tsx';
import "./HomePage.css"

export default function HomePage(){
	const { user } = useAuth();

	const roles: UserRoles[] = user == null ? [] : user?.groups.map(role => role.name);

	const isRespo = roles.includes(UserRoles.RESPO_TER) || roles.includes(UserRoles.ADMIN);
	const isEncadrant = roles.includes(UserRoles.ENCADRANT);
	const isStudent = roles.includes(UserRoles.ETUDIANT);

	return (
		<DashboardPage>
			<label style={{fontWeight: 800, fontSize: "25px"}}>Bonjour, {user?.first_name}!</label>

			{isRespo && <RespoDashboard/>}
			{isEncadrant && !isRespo && <EncadrantDashboard/>}
			{isStudent && <StudentHomePage/>}
			{!isRespo && !isEncadrant && !isStudent && (
				<span style={{color: "var(--gray1-col)"}}>Bienvenue sur Stud'Insight.</span>
			)}
		</DashboardPage>
	)
}
