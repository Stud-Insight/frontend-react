import React from "react";
import "./ScheduleEventWidget.css"

import { FaRegClock } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";

interface ScheduleEventWidgetProps {
	label: string;
	date: string;
	completed: boolean;
}

export default function ScheduleEventWidget({label, date, completed}: ScheduleEventWidgetProps){

	const className = `schedule-event-widget${completed ? " completed" : " pending"}`;
	const iconClassName = `schedule-event-widget-icon${completed ? " completed" : " pending"}`;
	return (
		<div className={className}>
			<div className={iconClassName}>
				{completed ? <FaRegCheckCircle size={20}/> : <FaRegClock size={20}/>}
			</div>

			<div className="schedule-event-widget-text">
				<span style={{fontWeight: "var(--big-bold)"}}>{label}</span>
				<span>{date}</span>
			</div>
		</div>
	)
}