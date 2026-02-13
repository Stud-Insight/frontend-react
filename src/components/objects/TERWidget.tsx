import React, { useEffect, useState } from "react";
import TERService, { TERPeriod, TERPeriodStats, TERStatusLabel } from "../../services/TERService";
import ContainerWidget from "../ui/ContainerWidget";
import TagWidget from "../../atoms/ui/Tag";
import Button from "../../atoms/input/Button";
import HorizontalDivider from "../ui/HorizontalDivider";
import ProgressWidget from "../ui/ProgressWidget";

import { FaArrowLeftLong } from "react-icons/fa6";
import { HiOutlineCalendar } from "react-icons/hi";

import "./TERWidget.css";

interface TERWidgetProps {
  data: TERPeriod;
  onClick?: () => void;
};

export default function TERWidget({ data, onClick }: TERWidgetProps){
	const [stats, setStats] = useState<TERPeriodStats | null>(null);

	const dateFormat = (dateString: string) =>
		new Date(dateString).toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

	useEffect(() => {
		const getTerData = async () => {
			try {
				const g = await TERService.getPeriodStats(data.id);
				setStats(g);
			} catch (err){
				console.log("Erreur Period Widget");
			}
		}
		
		getTerData();
	}, [data.id]);

	return (
		<ContainerWidget>
			<div className="ter-widget-title-layout">
				<div className="ter-widget-title-right-layout">
					<div className="ter-widget-title-container ">
						<label style={{ fontWeight: "var(--big-bold)", fontSize: 25 }}>
							{data.name}
						</label>
						<TagWidget label={TERStatusLabel.get(data.status)}/>
					</div>
					
					<div className="ter-widget-date-container">
						<HiOutlineCalendar/>

						<div className="ter-widget-date-layout">
							<label>{dateFormat(data.group_formation_start)}</label>
							<label>-</label>
							<label>{dateFormat(data.project_end ?? data.group_formation_end)}</label>
						</div>
					</div>
				</div>

				<HorizontalDivider/>

				<div className="ter-widget-info-layout">
					<div className="ter-widget-info-layout-container">
						<label style={{ color: "var(--gray1-col)" }}>Etudiants</label>
						<label style={{ fontWeight: "var(--big-bold)", fontSize: 30 }}>
							{stats?.students_enrolled}
						</label>
					</div>

					<div className="ter-widget-info-layout-container">
						<label style={{ color: "var(--gray1-col)" }}>Professeurs</label>
						<label style={{ fontWeight: "var(--big-bold)", fontSize: 30 }}>
							{0}
						</label>
					</div>

					<div className="ter-widget-info-layout-container">
						<label style={{ color: "var(--gray1-col)" }}>Groupes</label>
						<label style={{ fontWeight: "var(--big-bold)", fontSize: 30 }}>
							{stats?.groups_total}
						</label>
					</div>

					<div className="ter-widget-info-layout-container">
						<label style={{ color: "var(--gray1-col)" }}>Sujets</label>
						<label style={{ fontWeight: "var(--big-bold)", fontSize: 30 }}>
							{stats?.subjects_total}
						</label>
					</div>
				</div>
				
				<HorizontalDivider/>

				{/* <ProgressWidget progress={0.5}/> */}
				<div className="ter-widget-button-pos">
					<div>
						<Button icon={<FaArrowLeftLong/>} label="Voir Détailes" onClick={onClick}/>
					</div>
				</div>
			</div>
		</ContainerWidget>
	);
}
