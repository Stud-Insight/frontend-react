import React from "react";
import { RxCross2 } from "react-icons/rx";
import "./Tag.css"

interface TagProps {
	label: string;
	color?: string;
	onDelete?: () => void;
};

export default function Tag({label, color = "var(--blue-col)", onDelete}: TagProps){
	return (
		<div className="tag-widget-style" style={{color: `${color}`, backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`}}>
			{label}
			{onDelete && <RxCross2 onClick={onDelete}/>}
		</div>
	)
}