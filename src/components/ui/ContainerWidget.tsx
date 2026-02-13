import React, { ReactNode } from "react";
import HorizontalDivider from "./HorizontalDivider";

import "./ContainerWidget.css"

interface ContainerWidgetProps {
	icon?: ReactNode;
	label?: string;
	children?: ReactNode;
	active?: boolean;
	className?: string;
	onClick?: () => void;
}

export default function ContainerWidget({icon, label, active = false, children, className, onClick}: ContainerWidgetProps){
	return (
		<div className={`container-widget-layout ${active ? "active" : undefined} ${className}`} onClick={onClick}>
			{label != null && icon != null && 
				<div className="container-widget-title">
					{icon}
					<span>{label}</span>
				</div>
			}
			
			{label != null && icon != null && 
				<HorizontalDivider/>
			}
		
			<div id="content" className="container-widget-content">
				{children}
			</div>
		</div>
	)
}