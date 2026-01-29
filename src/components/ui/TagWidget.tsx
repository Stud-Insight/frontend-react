import React from "react";
import "./TagWidget.css"

interface TagWidgetProps {
	label: string;
	color?: string;
};

export default function TagWidget({label, color}: TagWidgetProps){
	return (
		<div className="tag-widget-style" style={{color: `${color}`, backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`}}>
			{label}
		</div>
	)
}