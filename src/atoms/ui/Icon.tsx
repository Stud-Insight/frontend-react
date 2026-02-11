import React, { ReactNode } from "react";
import "./Icon.css"

interface IconProps {
	icon: ReactNode;
	color?: string;
};

export default function Icon({icon, color = "red"}: IconProps){
	return (
		<div className="icon-atom-style" style={{color: color, backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`}}>
			{icon}
		</div>
	);	
}