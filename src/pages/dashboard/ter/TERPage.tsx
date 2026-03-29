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

export default function TERPage(){
	const { user } = useAuth();
	const [error, setError] = useState<string | null>();
	const [periods, setPeriods] = useState<TERPeriod[]>([]);
	const navigate = useNavigate();

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
		if (UserService.isStudent(user!)){
			navigate(`/dashboard/ter/${periods[0].id}`);
		}

		//un prof peut être associé à plusieur TER en même temps
		if (UserService.isProfessor(user!)){
			return (			
				<DashboardPage>
					<div className="dashboard-top-layout">
						<div className="dashboard-top-title-layout">
							<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Mes TER</span>
						</div>
					</div>

					<span style={{color: "var(--gray1-col)"}}>Détails et informations sur vos TER.</span>

					{periods && periods.map(per => (
						<TERWidget key={per.id} period={per} onClick={() => navigate(`/dashboard/ter/${per.id}`)}/>
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

			<span style={{color: "var(--gray1-col)"}}>Détails et informations sur vos TER.</span>

			{error ?  (
				<InfoBox label={error} type="error"/>
			) : (
				<EmptyWidget icon={<TbSchool size={30}/>} text="Vous n'êtes inscrit à aucun TER pour le moment."/>
			)}
		</DashboardPage>
	)
}