import React, {ReactNode} from "react";
import "./IconButton.css"

interface IconButtonInterface {
	icon: ReactNode;
	onClick: () => void;
};

export default function IconButton({icon, onClick}: IconButtonInterface){
	return (
		<div className="icon-button-close" onClick={onClick}>
			{icon}
		</div>
	)
}