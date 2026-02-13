import React, {useState, useEffect} from "react";
import InfoWidget from "../../components/ui/InfoWidget";
import TERPage from "./TERPage";
import { FaRegFile} from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";

import "./TERVotePage.css"

export default function TERVotePage(){
	const [error, setError] = useState<string | null>(null);
	const [period, setSelectedPeriod] = useState<TERPeriod | null>();
	
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
		<TERPage>
			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Etudiants" icon={<FiUser/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Groupes" icon={<FiUsers/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Sujets" icon={<FaRegFile/>} info={0} color="var(--blue-col)"/>
			</div>

			<div className="ter-list-page-layout">
				{/* <div className="ter-list-group-layout">
					{groups && groups.map((group, index) => {
						<GroupProjectWidget group={group}/>
					})}
				</div>

				<div className="ter-list-project-layout">
					{subjects && period.projects.map((project, index) => (
						<SubjectWidget project={project} privateMode={false}/>
					))}
				</div> */}
			</div>
		</TERPage>
	)
}