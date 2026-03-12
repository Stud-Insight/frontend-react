import React from "react";
import { TERPeriod } from "../../services/TERService";
import ProgressBar from "../ui/ProgressBar";
import ContainerWidget from "../ui/ContainerWidget";
import Tag from "../../atoms/ui/Tag";

import "./TERWidgetInfo.css"

interface TERWidgetInfoProps {
	period: TERPeriod;
}

function getCurrentPhase(period: TERPeriod) {
	const now = new Date();

	const phases = [
		{
			name: "Formation des groupes",
			start: new Date(period.group_formation_start),
			end: new Date(period.group_formation_end),
		},
		{
			name: "Choix des sujets",
			start: new Date(period.subject_selection_start!),
			end: new Date(period.subject_selection_end!),
		},
		{
			name: "Projet",
			start: new Date(period.project_start!),
			end: new Date(period.project_end!),
		}
	];

	for (let i = 0; i < phases.length; i++) {
		const phase = phases[i];

		if (now >= phase.start && now <= phase.end) {
			const progress = (now.getTime() - phase.start.getTime()) / (phase.end.getTime() - phase.start.getTime());

			return {
				label: phase.name,
				deadline: phase.end,
				progress,
				index: i + 1,
				total: phases.length
			};
		}
	}
	return null;
}

function getRemainingTime(deadline: Date) {
	const diff = deadline.getTime() - new Date().getTime();

	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

	return `${days}j ${hours}h`;
}

export default function TERWidgetInfo({period}: TERWidgetInfoProps) {
	const phase = getCurrentPhase(period);
	if (!phase) {
		return null;
	}

	const remaining = getRemainingTime(phase.deadline);

	return (
		<ContainerWidget className="ter-widget-info-style">
			<div className="ter-widget-info-header">
				<div className="ter-widget-info-text">
					<span>Phase: </span>
					<span>{phase.label}</span>
				</div>

				<Tag label={`${phase.index} / ${phase.total}`} color="var(--gray1-col)"/>
			</div>

			<ProgressBar current={phase.progress}/>

			<span>Deadline: {phase.deadline.toLocaleDateString()}</span>
		</ContainerWidget>
	)
}