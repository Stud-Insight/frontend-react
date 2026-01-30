import React, { ReactNode } from "react";
import { MdDangerous } from "react-icons/md";

import "./Button.css"

interface ButtonProps {
    label?: string;
	icon?: ReactNode;
	width?: number | string;
    style?: "cancel" | "danger";
    onChange?: () => void;
};

export default function Button({icon, label = "button", style, onChange, width}: ButtonProps){
	const getApproIcon = () => {
		if (style == "cancel"){
			return undefined
		} else if (style == "danger"){
			return <MdDangerous/>
		}

		return icon;
	};

	return (
		<button className={`button-style ${style}`} onClick={onChange} style={{width: width ? width : undefined}}>
			{getApproIcon()}
			<span className="button-label">{label}</span>
		</button>
	);
}