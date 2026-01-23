import React, {useState, useEffect}from "react";
import DashboardPage from "./DashboardPage";
import InfoWidget from "../../components/ui/InfoWidget";
import ContainerWidget from "../../components/ui/ContainerWidget";
import GroupProjectWidget from "../../components/objects/GroupProjectWidget";
import SubmitButton from "../../components/input/SubmitButton";
import InfoBox from "../../components/ui/InfoBox";

import { FaRegClock, FaRegCheckCircle, FaRegFile } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { GroupProject, GroupObjective } from "../../services/TERService";
import { Group } from "../../services/GroupService";
import { User } from "../../services/UserService";
import TERService, { TER } from "../../services/TERService";

import { ProjectStatus, Project } from "../../services/ProjectService";

import "./DashboardPage.css"
import "./TERAdminPage.css"

export default function TERAdminPage(){
	const [error, setError] = useState<string | null>(null);
	const [selectedTER, setSelectedTER] = useState<TER | null>();

	useEffect(() => {
		const getTer = async () => {
			try {
				const data = await TERService.getTER();
				setSelectedTER(data);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		getTer();
	}, []);

	return (
		<DashboardPage>
			<label style={{fontWeight: 800, fontSize: "25px"}}>Gestion TER</label>
			<label>Choose a TER to view detailed information about groups, projects, and professors.</label>

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Groupes" icon={<FiUsers/>} info={selectedTER ? selectedTER?.groups.length : 0} color="var(--blue-col)"/>
				<InfoWidget label="Projets" icon={<FaRegFile/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Encadrants" icon={<FiUser/>} info={0} color="var(--purple-col)"/>
				<InfoWidget label="Avançement Moyen" icon={<FaArrowTrendUp/>} info={`${0 * 100}%`} color="var(--orange-col)"/>
			</div>
			
			{error && <InfoBox label={error} type="error"/>}

			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Groupes</label>
				</div>
			
				<div className="dashboard-top-button-layout">
					<SubmitButton label="Créer un groupe"/>
				</div>
			</div>

			{selectedTER && selectedTER?.groups.map((group, index) => (
				<GroupProjectWidget group={group}/>
			))}
			
		</DashboardPage>
	)
}