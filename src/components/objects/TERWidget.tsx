import React, { useEffect, useState } from "react";
import TERService, { TERPeriod, TERPeriodStats, TERStatusLabel } from "../../services/TERService";
import ContainerWidget from "../ui/ContainerWidget";
import TagWidget from "../../atoms/ui/Tag";
import Button from "../../atoms/input/Button";
import HorizontalDivider from "../ui/HorizontalDivider";

import { FaArrowLeftLong } from "react-icons/fa6";
import { HiOutlineCalendar } from "react-icons/hi";
import { TbSchool } from "react-icons/tb";

import { MdDone } from "react-icons/md";
import Icon from "../../atoms/ui/Icon";

import "./TERWidget.css";

interface TERWidgetProps {
	period: TERPeriod;
	moreInfo?: boolean;
	selected?: boolean;
	onClick?: () => void;
	onSelect?: () => void;
};

export default function TERWidget({ period, onClick, onSelect, selected = false, moreInfo = true }: TERWidgetProps){
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
				const g = await TERService.getPeriodStats(period.id);
				setStats(g);
			} catch (err){
				console.log("Erreur TER Widget");
			}
		}

		const getProfessors = async () => {
			try {
				const g = await TERService.getProfessors(period.id);
				setProfessorCount(g.length);
			} catch (err){
				console.log("Erreur TER Widget");
			}
		}
	
		getTerData();
		getProfessors();
	}, [period.id]);

	return (
		<div className={`ter-widget-container ${selected ? "selected" : ""}`} onClick={onSelect}>
			<div className="ter-widget-title-layout">
				<div>
					<Icon icon={<TbSchool/>} color="var(--blue-col)"/>
				</div>

				<div className="ter-widget-title-right-layout">
					<div className="ter-widget-title-container">
						<span style={{ fontWeight: "var(--big-bold)", fontSize: 25 }}>
							{period.name}
						</span>
						<TagWidget label={TERStatusLabel.get(period.status)}/>
					</div>
					
					<div className="ter-widget-date-container">
						<HiOutlineCalendar/>

						<div className="ter-widget-date-layout">
							<span>{dateFormat(period.group_formation_start)}</span>
							<span>-</span>
							<span>{dateFormat(period.project_end ?? period.group_formation_end)}</span>
						</div>
					</div>
				</div>
			</div>
		
			{moreInfo &&
				<>
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
				
					<div className="ter-widget-button-pos">
						<div>
							<Button icon={<FaArrowLeftLong/>} label="Voir Détailes" onClick={onClick}/>
						</div>
					</div>
				</>
			}
			
			{onSelect &&
				<div className={`ter-widget-tick ${selected ? "selected" : ""}`}>
					<MdDone/>
				</div>
			}
		</div>
	);
}
