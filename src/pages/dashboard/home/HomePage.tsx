import React from 'react';
import DashboardPage from "../DashboardPage.tsx";
import { useAuth } from '../../../hooks/AuthContext.tsx';
import UserService, { UserRoles } from "../../../services/UserService.ts";
import StudentHomePage from './StudentHomePage.tsx';
import RespoDashboard from './RespoDashboard.tsx';
import EncadrantDashboard from './EncadrantDashboard.tsx';
import "./HomePage.css"

export default function HomePage(){
	const { user } = useAuth();

	const isRespo = user ? (UserService.isRespo(user) || UserService.isAdmin(user)) : false;
	const isEncadrant = user ? UserService.isProfessor(user) : false;
	const isStudent = user ? UserService.isStudent(user) : false;

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
