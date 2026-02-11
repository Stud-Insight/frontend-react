import React, { ReactNode } from "react";
import Field from "../../atoms/input/Field";

import "./InputArea.css"

interface InputAreaProps {
	label?: string;
	icon?: ReactNode;
	placeholder?: string;
	value?: string;
	onChange?: (text: string) => void;
};

export default function InputArea({label, icon, placeholder, value, onChange}: InputAreaProps){
	return (
		<Field label={label} icon={icon} className="input-area-layout">
			<textarea className="input-area-style" value={value} placeholder={placeholder} rows={10} onChange={onChange ? (e) => onChange(e.target.value) : undefined}/>
		</Field>
	);
}