import React, { ReactNode } from "react";
import Field from "../../atoms/input/Field";

import "./InputArea.css"

interface InputAreaProps {
	label?: string;
	icon?: ReactNode;
};

export default function InputArea({label, icon}: InputAreaProps){
	return (
		<Field label={label} icon={icon}>
			<textarea className="input-area-style" rows={10}>
				It was a dark and stormy night...
			</textarea>
		</Field>
	);
}