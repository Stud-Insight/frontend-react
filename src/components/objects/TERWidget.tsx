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
	const [professorCount, setProfessorCount] = useState<number>(0);

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
				console.log("Erreur TER Widget");
			}
		}

		const getProfessors = async () => {
			try {
				const g = await TERService.getProfessors(data.id);
				setProfessorCount(g.length);
			} catch (err){
				console.log("Erreur TER Widget");
			}
		}
	
		getTerData();
		getProfessors();
	}, [data.id]);

	return (
		<ContainerWidget>
			<div className="ter-widget-title-layout">
				<div className="ter-widget-title-right-layout">
					<div className="ter-widget-title-container ">
						<span style={{ fontWeight: "var(--big-bold)", fontSize: 25 }}>
							{data.name}
						</span>
						<TagWidget label={TERStatusLabel.get(data.status)}/>
					</div>
					
					<div className="ter-widget-date-container">
						<HiOutlineCalendar/>

						<div className="ter-widget-date-layout">
							<span>{dateFormat(data.group_formation_start)}</span>
							<span>-</span>
							<span>{dateFormat(data.project_end ?? data.group_formation_end)}</span>
						</div>
					</div>
				</div>

				<HorizontalDivider/>

				<div className="ter-widget-info-layout">
					<div className="ter-widget-info-layout-container">
						<span style={{ color: "var(--gray1-col)" }}>Etudiants</span>
						<span style={{ fontWeight: "var(--big-bold)", fontSize: 30 }}>
							{stats?.students_enrolled}
						</span>
					</div>

					<div className="ter-widget-info-layout-container">
						<span style={{ color: "var(--gray1-col)" }}>Professeurs</span>
						<span style={{ fontWeight: "var(--big-bold)", fontSize: 30 }}>
							{professorCount}
						</span>
					</div>

					<div className="ter-widget-info-layout-container">
						<span style={{ color: "var(--gray1-col)" }}>Groupes</span>
						<span style={{ fontWeight: "var(--big-bold)", fontSize: 30 }}>
							{stats?.groups_total}
						</span>
					</div>

					<div className="ter-widget-info-layout-container">
						<span style={{ color: "var(--gray1-col)" }}>Sujets</span>
						<span style={{ fontWeight: "var(--big-bold)", fontSize: 30 }}>
							{stats?.subjects_total}
						</span>
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
