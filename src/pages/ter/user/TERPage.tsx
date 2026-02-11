import React, { useEffect, useState, ReactNode } from "react";
import DashboardPage from "../../dashboard/DashboardPage";
import TERService, { TERPeriod } from "../../../services/TERService";
import InfoBox from "../../../components/ui/InfoBox";
import ProgressBar from "../../../components/ui/ProgressBar";

import { useNavigate } from "react-router-dom";

import "./TERPage.css";

interface TERPageProps {
	children: ReactNode;
};

enum TERPhase {
	GROUP_FORMATION,
	PROJECT_ASSIGNMENT,
	WORK,
	FINISHED,
}

export default function TERPage({children}: TERPageProps){
	const [error, setError] = useState<string | null>();
	const [period, setPeriod] = useState<TERPeriod | null>(null);
	const [phase, setPhase] = useState<TERPhase>(TERPhase.FINISHED);
	const navigate = useNavigate();

	const phaseLabel: Map<TERPhase, string> = new Map([
		[TERPhase.GROUP_FORMATION, "Choix des sujets et formation de groupe."],
		[TERPhase.PROJECT_ASSIGNMENT, "Affection des sujets par les encadrants."],
		[TERPhase.WORK, "Début du projet."],
		[TERPhase.FINISHED, "Fin du projet."],
	]);

	const getPeriodPhase = (period: TERPeriod) => {
		const current = new Date();
		const gp_start_date = new Date(period.group_formation_start);
		const gp_end_date = new Date(period.group_formation_end);
		const pj_start_date = new Date(period.subject_selection_start);
		const pj_end_date = new Date(period.subject_selection_end);
		const m_start_date = new Date(period.project_start);
		const m_end_date = new Date(period.project_end);

		if (current >= gp_start_date && current <= gp_end_date){
			return TERPhase.GROUP_FORMATION;
		}

		if (current >= pj_start_date && current <= pj_end_date){
			return TERPhase.PROJECT_ASSIGNMENT;
		}

		if (current >= m_start_date && m_end_date <= m_end_date){
			return TERPhase.WORK;
		}

		return TERPhase.FINISHED;
	};

	useEffect(() => {
		const getPeriod = async () => {
			try {
				const period = await TERService.getUserPeriod();
				
				if (period){
					setPhase(getPeriodPhase(period));
					
					if (phase == TERPhase.GROUP_FORMATION || true){
						navigate(`/dashboard/ter/${period.id}/vote`);
					} else if (phase == TERPhase.WORK){
						navigate(`/dashboard/ter/${period.id}/info`);
					}

					setPeriod(period);
				}

				return null;
			} catch(err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}
		
		getPeriod();
	}, [navigate]);

	return (
		<DashboardPage>
			{period ?
				<label className="ter-title-style">{period.academic_year} / {period.name}</label>
			: 
				<label className="ter-title-style">TER</label>
			}
	
			<ProgressBar label={`Phase: ${phaseLabel.get(phase)}`} current={0.3} tag={`${3} / ${10} jours`}/>
			{error && <InfoBox label={error} type="error"/>}
	
		
			{children}
		</DashboardPage>
	)
}