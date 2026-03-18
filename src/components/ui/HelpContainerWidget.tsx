import React, {useState, ReactNode } from "react";
import ContainerWidget from "./ContainerWidget";
import Icon from "../../atoms/ui/Icon";

import "./HelpContainerWidget.css"

interface HelpContainerWidgetProps {
	icon: ReactNode;
	color?: string;
	title: string;
	desc: string;
};

export default function HelpContainerWidget({icon, color, title, desc}: HelpContainerWidgetProps){
	return (
		<ContainerWidget>
			<div className="help-container-layout">
				<div>
					<Icon icon={icon} color={color}/>
				</div>
				<div className="help-container-text">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "20px"}}>{title}</span>
					<span style={{color: "var(--gray1-col)", fontWeight: "var(--mid-bold)", fontSize: "15px"}}>{desc}</span>
				</div>
			</div>
		</ContainerWidget>
	)
}