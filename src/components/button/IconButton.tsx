import React, { ReactNode } from "react";
import "./IconButton.css"

interface IconButtonProps {
	icon: ReactNode;
	size?: number;
	onClick?: () => void;
};

export default function IconButton({icon, size, onClick}: IconButtonProps){
	return (
		<div className="icon-button-close" onClick={onClick} style={{width: size, height: size}}>
			{icon}
		</div>
	)
}