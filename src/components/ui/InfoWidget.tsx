import React, { ReactNode } from "react";
import ContainerWidget from "./ContainerWidget";
import Icon from "../../atoms/ui/Icon";
import "./InfoWidget.css"

interface InfoWidgetProps {
	icon: ReactNode;
	color: string;
	label: string;
	info: string | number;
	active?: boolean;
	onClick?: () => void;
};

export default function InfoWidget({icon, label, info, active = false, color, onClick}: InfoWidgetProps){
	return (
		<ContainerWidget active={active} onClick={onClick}>
			<div className="info-widget-layout">
				<Icon icon={icon} color={color}/>
				<div className="info-widget-text">
					<label>{label}</label>
					<label style={{fontWeight: "var(--big-bold)", fontSize: 23, color: "var(--black-col)"}}>{info}</label>
				</div>
			</div>
		</ContainerWidget>
	)
}