import React, { useEffect, useState, ReactNode } from "react";
import DashboardPage from "../DashboardPage";
import TERService, { TERPeriod } from "../../../services/TERService";
import InfoBox from "../../../components/ui/InfoBox";
import UserService from "../../../services/UserService.ts";
import TERWidget from "../../../components/objects/TERWidget.tsx";
import EmptyWidget from "../../../components/ui/EmptyWidget.tsx";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/AuthContext.tsx";
import { TbSchool } from "react-icons/tb";

import "./TERPage.css";

interface TERPageProps {
	children?: ReactNode;
};

export default function TERPage({children}: TERPageProps){
	const { user } = useAuth();
	const [error, setError] = useState<string | null>();
	const [periods, setPeriods] = useState<TERPeriod[]>([]);
	const navigate = useNavigate();

	const selectPeriod = (period_id: string) => {
		// navigate(`/dashboard/ter/${period_id}/group_formation`);
		navigate(`/dashboard/ter/${period_id}/subject_vote`);
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

			<span style={{color: "var(--gray1-col)"}}>Détaile et information sur vos TER.</span>

			{error ?  (
				<InfoBox label={error} type="error"/>
			) : (
				<EmptyWidget icon={<TbSchool size={30}/>} text="Vous êtes inscris à aucun TER pour le moment."/>
			)}
		</DashboardPage>
	)
}