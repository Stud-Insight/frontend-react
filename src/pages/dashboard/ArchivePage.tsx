import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage";
import InfoBox from "../../components/ui/InfoBox";
import TERWidget from "../../components/objects/TERWidget";
import TERService, { TERPeriod, TERStatus, TERStatusColor } from "../../services/TERService";
import InfoWidget from "../../components/ui/InfoWidget";
import { TbSchool } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import "./ArchivePage.css"

export default function ArchivePage(){
	const [error, setError] = useState<string | null>(null);
	const [archivedTerList, setArchivedTerList] = useState<TERPeriod[]>([]);
	const navigate = useNavigate();

	const getArchivedTer = async () => {
		try {
			const data = await TERService.getPeriods();
			setArchivedTerList(data.filter(t => t.status === TERStatus.ARCHIVED));
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	useEffect(() => {
		getArchivedTer();
	}, []);

	const clickHandle = (id: string) => {
		navigate(`/dashboard/ter/${id}/admin`);
	}

	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Archives</span>
				</div>
			</div>
			<span style={{color: "var(--gray1-col)"}}>Consultez les TER et Stages archivés. Les données sont en lecture seule.</span>

			{error && <InfoBox label={error} type="error"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="TER Archivés" icon={<TbSchool/>} info={archivedTerList.length} color={TERStatusColor.get(TERStatus.ARCHIVED)}/>
			</div>

			{archivedTerList.length === 0 && !error &&
				<span style={{color: "var(--gray1-col)", fontStyle: "italic"}}>Aucune période archivée pour le moment.</span>
			}

			{archivedTerList.map(ter => (
				<TERWidget key={ter.id} period={ter} onClick={() => clickHandle(ter.id)} moreInfo={true}/>
			))}
		</DashboardPage>
	)
}
