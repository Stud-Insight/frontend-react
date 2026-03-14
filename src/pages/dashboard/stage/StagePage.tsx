import React, {useState, useEffect, use } from "react";
import DashboardPage from "../DashboardPage";
import StageService, { StagePeriod } from "../../../services/StageService";
import EmptyWidget from "../../../components/ui/EmptyWidget";
import { MdWorkOutline } from "react-icons/md";

import "./StagePage.css"

export default function StagePage(){
	const [period, setPeriod] = useState<StagePeriod | null>(null)

	useEffect(() => {
		const getStagePeriod = async () => {
			try {

			} catch(err) {

			}
		};

		getStagePeriod();
	}, []);
	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Stages</span>
				</div>
			</div>

			<span style={{color: "var(--gray1-col)"}}>Détaile et information sur les stages.</span>

			{period == null && 
				<EmptyWidget icon={<MdWorkOutline size={30}/>} text="Aucune periode de stage pour le moment."/>
			}
		</DashboardPage>
	)
}