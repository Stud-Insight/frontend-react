import React, {useState } from "react";
import { FaCheck } from "react-icons/fa6";

import "./InputCheckbox.css"

interface InputCheckboxInterface {
	value: boolean;
	onChange?: () => void;
};

export default function InputCheckbox({value = false, onChange}: InputCheckboxInterface){
	const [checked, setChecked] = useState(value);
	
	const check_handler = () => {
		setChecked(!checked);
		onChange ? onChange() : undefined;
	}

	return (
		<div className={checked ? "checkbox-style checked" : "checkbox-style"} onClick={(check_handler)}>
			<FaCheck className={checked ? "checkbox-style-check" : "checkbox-style-uncheck"}/>
		</div>
	);
}

