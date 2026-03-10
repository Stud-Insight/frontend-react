import React, { useEffect, useState, ReactNode } from "react";
import DashboardPage from "../DashboardPage";
import TERService, { TERPeriod } from "../../../services/TERService";
import InfoBox from "../../../components/ui/InfoBox";
import UserService from "../../../services/UserService.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.tsx";
import TERWidget from "../../../components/objects/TERWidget.tsx";

import "./TERPage.css";

interface TERPageProps {
	children?: ReactNode;
};

enum TERPhase {
	GROUP_FORMATION,
	PROJECT_ASSIGNMENT,
	WORK,
	FINISHED,
}

export default function TERPage({children}: TERPageProps){
	const { user } = useAuth();
	const [error, setError] = useState<string | null>();
	const [periods, setPeriods] = useState<TERPeriod[]>([]);
	const [phase, setPhase] = useState<TERPhase>(TERPhase.FINISHED);
	const [start, setStart] = useState<Date>(new Date());
	const [deadline, setDeadline] = useState<Date>(new Date());

	const navigate = useNavigate();

	// const formatDate = (date: Date) =>
	// 	date.toLocaleDateString("en-GB", {
	// 	month: "long",
	// 	day: "numeric",
	// 	year: "numeric",
	// });

	// const phaseLabel: Map<TERPhase, string> = new Map([
	// 	[TERPhase.GROUP_FORMATION, "Choix des sujets et formation de groupe."],
	// 	[TERPhase.PROJECT_ASSIGNMENT, "Affection des sujets par les encadrants."],
	// 	[TERPhase.WORK, "Début du projet."],
	// 	[TERPhase.FINISHED, "Fin du projet."],
	// ]);

	// const getPeriodPhase = (period: TERPeriod) => {
	// 	const current = new Date();
	// 	const gp_start_date = new Date(period.group_formation_start);
	// 	const gp_end_date = new Date(period.group_formation_end);
	// 	const pj_start_date = new Date(period.subject_selection_start);
	// 	const pj_end_date = new Date(period.subject_selection_end);
	// 	const m_start_date = new Date(period.project_start);
	// 	const m_end_date = new Date(period.project_end);

	// 	if (current >= gp_start_date && current <= gp_end_date){
	// 		setStart(gp_start_date);
	// 		setDeadline(gp_end_date);
	// 		return TERPhase.GROUP_FORMATION;
	// 	}

	// 	if (current >= pj_start_date && current <= pj_end_date){
	// 		setStart(pj_start_date);
	// 		setDeadline(pj_end_date);
	// 		return TERPhase.PROJECT_ASSIGNMENT;
	// 	}

	// 	if (current >= m_start_date && current <= m_end_date){
	// 		setStart(m_start_date);
	// 		setDeadline(m_end_date);
	// 		return TERPhase.WORK;
	// 	}

	// 	return TERPhase.FINISHED;
	// };

	// const getDaysBetween = (start: Date, end: Date): number => {
	// 	const p = 1000 * 60 * 60 * 24;
	// 	return 10;
	// 	return Math.floor((end.getTime() - start.getTime()) / p);
	// }

	const selectPeriod = (period_id: string) => {
		navigate(`/dashboard/ter/${period_id}/vote`);
	}

	useEffect(() => {
		const getPeriods = async () => {
			try {
				const periods = await TERService.getMyPeriods();
				setPeriods(periods);
			} catch(err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}
		
		getPeriods();
	}, [navigate]);

	if (periods.length > 0){
		//Un etudiant est associé à un seul TER à un moment t
		if (UserService.isStudent(user)){
			selectPeriod(periods[0].id);
		}

		//un prof peut être associé à plusieur TER en même temps
		if (UserService.isProfessor(user)){
			return (			
				<DashboardPage>
					<div className="dashboard-top-layout">
						<div className="dashboard-top-title-layout">
							<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Mes TER</span>
						</div>
					</div>

					<span style={{color: "var(--gray1-col)"}}>Créez et gérez vos propositions de sujet TER.</span>

					{periods && periods.map(per => (
						<TERWidget key={per.id} period={per} onClick={() => selectPeriod(per.id)}/>
					))}
				</DashboardPage>
			)		
		}
	}

	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Mes TER</span>
				</div>
			</div>
			{error 
				? 
					<InfoBox label={error} type="error"/>
				:
				<>
					<InfoBox type="info" label="Vous n’êtes actuellement inscrit à aucun TER."/>	
				</>
			}
		</DashboardPage>
	)
}