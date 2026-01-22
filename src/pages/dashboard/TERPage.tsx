import React from "react"
import DashboardPage from "./DashboardPage";
import ContainerWidget from "../../components/ui/ContainerWidget";
import UserWidget from "../../components/ui/UserWidget";
import ScheduleEventWidget from "../../components/ui/ScheduleEventWidget";

import { FiUsers } from "react-icons/fi";
import { HiOutlineMenu } from "react-icons/hi";
import { FiUser } from "react-icons/fi";

import { User } from "../../services/UserService";

import "./TERPage.css"

export default function TERPage(){
	const mock_user: User = {
		id: "1",
		email: "vincent.hannah@etu.umontpellier.fr",
		first_name: "Vincent",
		last_name: "Hannah"
	};
	
	return (
		<DashboardPage>
			<label style={{fontWeight: 800, fontSize: "25px"}}>TER Information</label>
			<label>Details about your TER, team, and schedule</label>

			<ContainerWidget icon={<FiUser/>} label="Encadrant">
				<UserWidget user={mock_user}/>
			</ContainerWidget>

			<div className="ter-page-container-layout">
				<ContainerWidget icon={<FiUsers/>} label="Membres (4)">
					<UserWidget user={mock_user} role="Frontend"/>
					<UserWidget user={mock_user} role="Frontend"/>
					<UserWidget user={mock_user} role="Frontend"/>
					<UserWidget user={mock_user} role="Frontend"/>
					<UserWidget user={mock_user} role="Frontend"/>
					<UserWidget user={mock_user} role="Frontend"/>
				</ContainerWidget>

				<ContainerWidget icon={<HiOutlineMenu/>} label="Objectifs">
					<ScheduleEventWidget label="Project Proposal Submission" date="Oct 15, 2025" completed={true}/>
					<ScheduleEventWidget label="Project Proposal Submission" date="Oct 15, 2025" completed={false}/>
				</ContainerWidget>
			</div>

			<div className="ter-page-container-layout">
				<ContainerWidget icon={<FiUsers/>} label="Membres">
					<UserWidget user={mock_user} role="Frontend"/>
					<UserWidget user={mock_user} role="Frontend"/>
					<UserWidget user={mock_user} role="Frontend"/>
				</ContainerWidget>

				<ContainerWidget icon={<HiOutlineMenu/>} label="Objectifs">
					<UserWidget user={mock_user} role="Frontend"/>
					<UserWidget user={mock_user} role="Frontend"/>
				</ContainerWidget>
			</div>
			
		</DashboardPage>
	)
}