import React, {ReactNode} from "react";
import "./IconButton.css"

interface IconButtonProps {
	icon: ReactNode;
	onClick?: () => void;
};

export default function IconButton({icon, onClick}: IconButtonProps){
	return (
		<div className="icon-button-close" onClick={onClick}>
			{icon}
		</div>
	)
}