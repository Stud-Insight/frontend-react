import React, { ReactNode, useRef } from "react";
import "./Field.css"

interface FieldProps {
	label?: string,
	icon?: ReactNode,
	children: ReactNode,
	className?: string;
	onClick?: () => void;
};

export default function Field({label, icon, children, onClick, className}: FieldProps){
	return (
		<div className="field-layout">
			<div className="field-label">
				{icon}
				{label && <label>{label}</label>}
			</div>

			<div className={`field-content ${className}`} onClick={onClick}>
				{children}
			</div>
		</div>
	);
}