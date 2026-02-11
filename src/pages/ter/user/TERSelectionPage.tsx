import React, {useState, useEffect} from "react";
import DashboardPage from "../../dashboard/DashboardPage";
import InfoBox from "../../../components/ui/InfoBox";
import InfoWidget from "../../../components/ui/InfoWidget";
import TERService, { TERPeriod } from "../../../services/TERService";
import ContainerWidget from "../../../components/ui/ContainerWidget";
import GroupProjectWidget from "../../../components/objects/GroupProjectWidget";
import ProjectWidget from "../../../components/objects/SubjectWidget";

import { FaRegFile, FaRegClock } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";

import "./TERSelectionPage.css"
import "../../dashboard/DashboardPage.css"

export default function PeriodSelectionPage(){
	const [error, setError] = useState<string | null>(null);
	const [selectedPeriod, setSelectedPeriod] = useState<TERPeriod | null>();
	
	useEffect(() => {
		const getTer = async () => {
			try {
				// const data = await TERService.getPeriod();
				setSelectedPeriod(data);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		getTer();
	}, []);
	
	return (
		<DashboardPage>
			<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>TER & Groupes Selection</label>
			<label style={{color: "var(--gray1-col)"}}>Join a group and vote for your preferred Period project.</label>

			{error && <InfoBox label={error} type="error"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Etudiants" icon={<FiUser/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Groupes" icon={<FiUsers/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Projets" icon={<FaRegFile/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Deadline" icon={<FaRegClock/>} info={`100 Jours`} color="var(--orange-col)"/>
			</div>

			<ContainerWidget/>
			
			<div className="ter-list-page-layout">
				<div className="ter-list-group-layout">
					{/* {selectedPeriod && selectedPeriod.groups.map((group, index) => (
						<GroupProjectWidget group={group}/>
					))} */}
				</div>

				<div className="ter-list-project-layout">
					{/* {selectedPeriod && selectedPeriod.projects.map((project, index) => (
						<ProjectWidget project={project} privateMode={false}/>
					))} */}
				</div>
			</div>
		</DashboardPage>
	)
}