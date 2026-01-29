import React from "react";

import "./ProgressWidget.css"

interface ProgressWidgetProps {
	label?: string
	progress: number;
}

export default function ProgressWidget({label, progress}: ProgressWidgetProps){
	return (
		<div className="progress-widget-layout">
			{label && (
				<div className="progress-widget-top">
					<label>{label}</label>
					<label>{Math.round(progress * 100)}%</label>
				</div>
			)}

			<div className="progress-widget-bar">
				<div className="progress-widget-background" />
				<div className="progress-widget-actual-progress" style={{ width: `${progress * 100}%` }}/>
			</div>
		</div>
	)
}