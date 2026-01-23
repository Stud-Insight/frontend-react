import React, { ReactNode } from "react";
import ContainerWidget from "./ContainerWidget";

import "./InfoWidget.css"

interface InfoWidgetProps {
	icon: ReactNode;
	color: string;
	label: string;
	info: string;
};

export default function InfoWidget({icon, label, info, color}: InfoWidgetProps){
	return (
		<div className="info-widget-main-container">
			<div className="info-widget-layout">
				<div className="info-widget-icon" style={{color: color, backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`}}>
					{icon}
				</div>
				<div className="info-widget-text">
					<label>{label}</label>
					<label style={{fontWeight: "var(--big-bold)", fontSize: 30}}>{info}</label>
				</div>
			</div>
		</div>
	)
}