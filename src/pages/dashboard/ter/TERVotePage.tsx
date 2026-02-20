import React, {useState, useEffect} from "react";
import InfoWidget from "../../../components/ui/InfoWidget";
import DashboardPage from "../DashboardPage";
import TERService, { TERPeriod } from "../../../services/TERService";
import { Subject, SubjectStatus } from "../../../services/SubjectService";
import GroupProjectWidget from "../../../components/objects/GroupProjectWidget";
import GroupService, { Group } from "../../../services/GroupService";
import SubjectWidget from "../../../components/objects/SubjectWidget";
import ProgressBar from "../../../components/ui/ProgressBar"
import InfoBox from "../../../components/ui/InfoBox";
import { FaRegFile} from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";

import "./TERVotePage.css"

import { useParams } from "react-router-dom";

export default function TERVotePage(){
	const { id } = useParams<{ id: string }>();
	const [error, setError] = useState<string | null>(null);
	const [period, setPeriod] = useState<TERPeriod | null>();
	const [groups, setGroups] = useState<Group[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([]);

	useEffect(() => {
		const getGroups = async () => {
			try {
				const res = await GroupService.getGroups(id);
				res.sort((a, b) => (
					a.name.localeCompare(b.name)
				))
				setGroups(res);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		const getPeriod = async () => {
			try {
				const res = await TERService.getPeriod(id);
				console.log(res);
				setPeriod(res);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		const getSubjects = async () => {
			try {
				const res = await TERService.getSubjects(id);
				setSubjects(res);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		getSubjects();
		getGroups();
		getPeriod();
	}, []);
		
	return (
		<DashboardPage>
			{period &&
				<>
					<div className="dashboard-top-layout">
						<div className="dashboard-top-title-layout">
							<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>{period.academic_year} / {period.name}</span>
						</div>
					</div>

					<ProgressBar label={`Phase: vote`} current={0.3} tag={`${3} / 20} jours`} subtext={`Deadline: `}/>
				</>			
			}

			{error && <InfoBox label={error} type="error"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Etudiants" icon={<FiUser/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Groupes" icon={<FiUsers/>} info={groups.length} color="var(--blue-col)"/>
				<InfoWidget label="Sujets" icon={<FaRegFile/>} info={subjects.length} color="var(--blue-col)"/>
			</div>

			<div className="ter-list-page-layout">
				<div className="ter-list-group-layout">
					{groups && groups.map(group => (
						<GroupProjectWidget admin={false} key={group.id} group={group}/>
					))}
				</div>

				<div className="ter-list-project-layout">
					{subjects && subjects.filter(sub => (sub.status == SubjectStatus.VALIDATED)).map(subject => (
						<SubjectWidget subject={subject} privateMode={false}/>
					))}
				</div>
			</div>
		</DashboardPage>
	)
}