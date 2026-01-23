import React from "react";
import DashboardPage from "./DashboardPage";
import InfoWidget from "../../components/ui/InfoWidget";
import ContainerWidget from "../../components/ui/ContainerWidget";

import { FaRegClock, FaRegCheckCircle, FaRegFile } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import "./DashboardPage.css"
import "./TERAdminPage.css"

export default function TERAdminPage(){
	return (
		<DashboardPage>
			<label style={{fontWeight: 800, fontSize: "25px"}}>Gestion TER</label>
			<label>Choose a TER to view detailed information about groups, projects, and professors.</label>

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Groupes" icon={<FiUsers/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Projets" icon={<FaRegFile/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Encadrant" icon={<FiUser/>} info={0} color="var(--purple-col)"/>
				<InfoWidget label="Avançement Moyen" icon={<FaArrowTrendUp/>} info={`${0 * 100}%`} color="var(--orange-col)"/>
			</div>

			<ContainerWidget icon={<FiUsers/>} label="Groupes">
				
			</ContainerWidget>

			<ContainerWidget icon={<FiUser/>} label="Encadrant">
				
			</ContainerWidget>
		</DashboardPage>
	)
}