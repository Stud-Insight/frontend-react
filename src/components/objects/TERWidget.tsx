import React, {useEffect, useState} from "react";
import TERService, { TERPeriod, TERPeriodStats } from "../../services/TERService";
import ContainerWidget from "../ui/ContainerWidget";
import TagWidget from "../ui/TagWidget";
import VerticalDivider from "../ui/VerticalDivider";
import SubmitButton from "../input/SubmitButton";
import { FaArrowLeftLong } from "react-icons/fa6";
import { TbSchool } from "react-icons/tb";

import "./TERWidget.css";

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
				<div className="ter-widget-icon">
					<TbSchool/>
				</div>

				<div className="ter-widget-title-right-layout">
					<label style={{ fontWeight: "var(--big-bold)", fontSize: 20 }}>
						{data.name}
					</label>

					<div className="ter-widget-date-layout">
						<label>{dateFormat(data.group_formation_start)}</label>
						<label>-</label>
						<label>{dateFormat(data.project_end ?? data.group_formation_end)}</label>
					</div>

					<label style={{ color: "var(--gray1-col)" }}>{data.academic_year}</label>
				</div>

				<VerticalDivider/>

				<div className="ter-widget-tag-pos">
					<TagWidget label={data.status.toUpperCase()} color={statusColor}/>
				</div>
				
				<div className="ter-widget-info-layout">
					{/* <div className="ter-widget-info-layout-container">
						<label style={{ color: "var(--gray1-col)" }}>Taille groupes</label>
						<label style={{ fontWeight: "var(--big-bold)", fontSize: 30 }}>
							{data.min_group_size}–{data.max_group_size}
						</label>
					</div> */}

					<div className="ter-widget-info-layout-container">
						<label style={{ color: "var(--gray1-col)" }}>Etudiants</label>
						<label style={{ fontWeight: "var(--big-bold)", fontSize: 30 }}>
							{stats?.students}
						</label>
					</div>

					<div className="ter-widget-info-layout-container">
						<label style={{ color: "var(--gray1-col)" }}>Groupes</label>
						<label style={{ fontWeight: "var(--big-bold)", fontSize: 30 }}>
							{stats?.groups}
						</label>
					</div>

					<div className="ter-widget-info-layout-container">
						<label style={{ color: "var(--gray1-col)" }}>Sujets</label>
						<label style={{ fontWeight: "var(--big-bold)", fontSize: 30 }}>
							{stats?.subjects}
						</label>
					</div>
				</div>
				
				<VerticalDivider/>

				<div>
					<SubmitButton icon={<FaArrowLeftLong/>} label="Voir détails" onChange={onClick}/>
				</div>
			</div>
		</ContainerWidget>
	);
}
