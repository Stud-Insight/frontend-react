import React, { useEffect, useState } from "react";
import TERService, { TERPeriod, TERPeriodStats, TERStatus, TERStatusLabel, TERStatusColor } from "../../services/TERService";
import ContainerWidget from "../ui/ContainerWidget";
import Tag from "../../atoms/ui/Tag";
import Button from "../../atoms/input/Button";
import HorizontalDivider from "../ui/HorizontalDivider";

import { FaArrowLeftLong } from "react-icons/fa6";
import { FiArchive } from "react-icons/fi";
import { HiOutlineCalendar } from "react-icons/hi";
import { TbSchool } from "react-icons/tb";

import { MdDone } from "react-icons/md";
import Icon from "../../atoms/ui/Icon";

import "./TERWidget.css";

interface TERWidgetProps {
	period: TERPeriod;
	selected?: boolean;
	onClick?: () => void;
	onSelect?: () => void;
	onArchive?: () => void;
};

export default function TERWidget({period, onClick, onSelect, onArchive, selected = false}: TERWidgetProps){
	const dateFormat = (dateString: string) =>
		new Date(dateString).toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

	return (
		<ContainerWidget className={`ter-widget-container ${selected ? "selected" : ""}`} onClick={onSelect}>
			<div className="ter-widget-title-layout">
				<div>
					<Icon icon={<TbSchool/>} color="var(--blue-col)"/>
				</div>

				<div className="ter-widget-title-right-layout">
					<div className="ter-widget-title-container">
						<span style={{ fontWeight: "var(--big-bold)", fontSize: 25 }}>
							{period.name}
						</span>
						<Tag label={TERStatusLabel.get(period.status)} color={TERStatusColor.get(period.status)}/>
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

				<div className="ter-widget-button-pos">
					{onArchive && period.status === TERStatus.CLOSED &&
						<Button icon={<FiArchive/>} label="Archiver" style="danger" onClick={onArchive}/>
					}
					<Button icon={<FaArrowLeftLong/>} label="Voir Détails" onClick={onClick}/>
				</div>
			</div>
		</ContainerWidget>
	);
}
