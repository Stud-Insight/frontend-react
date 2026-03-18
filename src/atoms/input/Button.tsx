import React, { ReactNode } from "react";
import { MdDangerous } from "react-icons/md";

import "./Button.css"

interface ButtonProps {
    label?: string;
	icon?: ReactNode;
	height?: number | string;
	width?: number | string;
    style?: "cancel" | "danger";
	color?: string;
    onClick?: () => void;
};

export default function Button({icon, label, height = "30px", style, onClick, width, color}: ButtonProps){
	const getApproIcon = () => {
		if (style == "cancel"){
			return undefined
		} else if (style == "danger"){
			return <MdDangerous/>
		}

		return icon;
	};

	return (
		<button className={`button-style ${label ? style : ""}`} style={{width: width, backgroundColor: color, height: height}} onClick={onClick}>
			{getApproIcon()}
			<span className="button-label">{label}</span>
		</button>
	);
}