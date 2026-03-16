import React, { useState, useEffect, ReactNode } from "react"
import TERWidgetInfo from "../../../components/objects/TERWidgetInfo";
import TERService, { TERPeriod, TERPhase } from "../../../services/TERService";
import InfoBox from "../../../components/ui/InfoBox";
import { Subject } from "../../../services/SubjectService";
import { useParams } from "react-router-dom";
import DashboardPage from "../DashboardPage";

import TERGroupView from "./TERGroupView";
import TERSubjectView from "./TERSubjectView";
import "./TERDetailPage.css"

export default function TERDetailPage(){
	const { id } = useParams<{ id: string }>();
	const [error, setError] = useState<string | null>();
	const [success, setSuccess] = useState<string | null>();
	const [subject, setSubject] = useState<Subject | null>();
	const [period, setPeriod] = useState<TERPeriod | null>(null);
	const [phase, setPhase] = useState<TERPhase>();
	
	const viewHandler = (phase: TERPhase) => {
		switch (phase) {
			case TERPhase.FORMATION: {
				return <TERGroupView period={period}/>
			}

			case TERPhase.SELECTION: {
				return <TERGroupView period={period}/>
			}
		}
	}

	useEffect(() => {
		const getPeriod = async () => {
			try {
				const res = await TERService.getPeriod(id);
				setPeriod(res);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

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

					<TERWidgetInfo period={period}/>

					{error && <InfoBox label={error} type="error"/>}
					{success && <InfoBox label={success} type="success"/>}

					{viewHandler(TERPhase.FORMATION)}
				</>
			}
		</DashboardPage>
	)
}