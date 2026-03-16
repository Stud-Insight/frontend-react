import React from "react";
import TERService, { TERPeriod, TERPhaseLabel, TERPhaseColor } from "../../services/TERService";
import ProgressBar from "../ui/ProgressBar";
import ContainerWidget from "../ui/ContainerWidget";
import Tag from "../../atoms/ui/Tag";
import Icon from "../../atoms/ui/Icon";
import { HiOutlineCalendar } from "react-icons/hi";

import "./TERWidgetInfo.css"

interface TERWidgetInfoProps {
	period: TERPeriod;
}

function getRemainingTime(deadline: Date) {
	const diff = deadline.getTime() - new Date().getTime();

	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

	return `${days}j ${hours}h`;
}

export default function TERWidgetInfo({period}: TERWidgetInfoProps) {
	const phase = TERService.getPeriodPhase(period);

	if (!phase) {
		return null;
	}

	const remaining = getRemainingTime(phase.deadline);

	return (
		<ContainerWidget>
			<div className="ter-widget-info-style">
				<div>
					<Icon icon={<HiOutlineCalendar/>} color="var(--blue-col)"/>
				</div>

				<div className="ter-widget-info-content">
					<div className="ter-widget-info-header">
						<div className="ter-widget-info-text">
							<span>Phase: </span>
							<Tag label={TERPhaseLabel.get(phase.phase)} color={TERPhaseColor.get(phase.phase)}/>
						</div>

						<span>{`${phase.daysLeft} Jours Restants`}</span>
					</div>
					<span>Deadline: {phase.deadline.toLocaleDateString()}</span>

					<ProgressBar current={phase.progress}/>
				</div>
			</div>
		</ContainerWidget>
	)
}