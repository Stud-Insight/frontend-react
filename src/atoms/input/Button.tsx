import React, { ReactNode } from "react";
import { MdDangerous } from "react-icons/md";

import "./Button.css"

interface ButtonProps {
    label?: string;
	icon?: ReactNode;
	width?: number | string;
    style?: "cancel" | "danger";
    onClick?: () => void;
};

export default function Button({icon, label, style, onClick, width}: ButtonProps){
	const getApproIcon = () => {
		if (style == "cancel"){
			return undefined
		} else if (style == "danger"){
			return <MdDangerous/>
		}

		return icon;
	};

	return (
		<button className={`button-style ${label ? style : ""}`} onClick={onClick} style={{width: width ? width : undefined}}>
			{getApproIcon()}
			<span className="button-label">{label}</span>
		</button>
	);
}