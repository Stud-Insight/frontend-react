import React from "react";
import { RxCross2 } from "react-icons/rx";
import "./Tag.css"

interface TagProps {
	label: string | undefined;
	color?: string;
	className?: string;
	onDelete?: () => void;
	onSelect?: () => void;
};

export default function Tag({label, color = "var(--gray1-col)", onDelete, onSelect, className = ""}: TagProps){
	return (
		<div className={`tag-widget-style ${className}`} style={{color: `${color}`, backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`}} onClick={onSelect}>
			{label}
			{onDelete && 
				<div className="icon-widget-style">
					{<RxCross2 onClick={onDelete}/>}
				</div>
			}
		</div>
	)
}