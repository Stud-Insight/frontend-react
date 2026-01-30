import React from "react";
import "./Tag.css"

interface TagProps {
	label: string;
	color?: string;
};

export default function Tag({label, color}: TagProps){
	return (
		<div className="tag-widget-style" style={{color: `${color}`, backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`}}>
			{label}
		</div>
	)
}