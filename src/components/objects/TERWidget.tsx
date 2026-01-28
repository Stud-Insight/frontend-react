import React, {useEffect, useState} from "react";
import TERService, { TERPeriod, TERPeriodStats } from "../../services/TERService";
import ContainerWidget from "../ui/ContainerWidget";
import TagWidget from "../ui/TagWidget";
import VerticalDivider from "../ui/VerticalDivider";
import SubmitButton from "../input/SubmitButton";
import { FaArrowLeftLong } from "react-icons/fa6";
import { HiOutlineCalendar } from "react-icons/hi";
import { TbSchool } from "react-icons/tb";

import "./TERWidget.css";
import HorizontalDivider from "../ui/HorizontalDivider";
import ProgressWidget from "../ui/ProgressWidget";

interface TERWidgetProps {
  data: TERPeriod;
  onClick?: () => void;
}

export default function TERWidget({ data, onClick }: TERWidgetProps){
	const [stats, setStats] = useState<TERPeriodStats | null>(null);

	const dateFormat = (dateString: string) =>
		new Date(dateString).toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

  	const statusColor = {
		draft: "var(--gray1-col)",
		open: "var(--green-col)",
		closed: "var(--orange-col)",
		archived: "var(--gray2-col)",
  	}[data.status];

	useEffect(() => {
		const getTerData = async () => {
			try {
				const g = await TERService.getPeriodStats(data.id);
				setStats(g);
			} catch (err){
				console.log("Erreur TER Widget");
			}
		}
		
		getTerData();
	}, [data.id]);

	return (
		<ContainerWidget>
			<div className="ter-widget-title-layout">
				{/* <div className="ter-widget-tag-pos">
					<TagWidget label={data.status.toUpperCase()} color={statusColor}/>
				</div> */}

	
				<div className="ter-widget-title-right-layout">
					<div className="ter-widget-title-container ">
						<label style={{ fontWeight: "var(--big-bold)", fontSize: 25 }}>
							{data.name}
						</label>
						<TagWidget label={data.status.toUpperCase()} color={statusColor}/>
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

				<ProgressWidget progress={0.5}/>
				<div className="ter-widget-button-pos">
					<div>
						<SubmitButton icon={<FaArrowLeftLong/>} label="Voir Détailes" onChange={onClick}/>
					</div>
				</div>
			</div>
		</ContainerWidget>
	);
}
