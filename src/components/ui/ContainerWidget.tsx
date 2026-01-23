import React, { ReactNode } from "react";
import HorizontalDivider from "./HorizontalDivider";

import "./ContainerWidget.css"

interface ContainerWidgetProps {
	icon?: ReactNode;
	label?: string;
	children?: ReactNode;
}

export default function ContainerWidget({icon, label, children}: ContainerWidgetProps){
	return (
		<div className="container-widget-layout">
			{label != null && icon != null && 
				<div className="container-widget-title">
					{icon}
					<label>{label}</label>
				</div>
			}
			

			{label != null && icon != null && 
				<HorizontalDivider/>
			}
		
			<div className="container-widget-content">
				{children}
			</div>
		</div>
	)
}