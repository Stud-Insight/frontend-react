import React, { ReactNode }from "react";
import InputDropdown from "./InputDropdown";

import "./InputTagSelection.css"

interface InputTagSelectionProps {
	label?: string;
	icon?: ReactNode;
	value?: string;
	options: string[];
};

export default function InputTagSelection({label, icon, value = "", options}: InputTagSelectionProps){
	return (
		<div>
			<InputDropdown label={label} icon={icon} value={value} options={options}/>
		</div>
	)
}