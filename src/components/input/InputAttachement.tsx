import React, { ReactNode } from "react";
import Field from "../../atoms/input/Field";

interface InputAttachementProps {
	label?: string;
	icon?: ReactNode;
}

export default function InputAttachement({label, icon}: InputAttachementProps){
	return (
		<Field label={label} icon={icon} className="input-attachement-style">
			<label>elelel</label>
		</Field>
	)
}