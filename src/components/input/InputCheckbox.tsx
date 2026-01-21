import React, {useState } from "react";
import { FaCheck } from "react-icons/fa6";

import "./InputCheckbox.css"

interface InputCheckboxInterface {
	value?: boolean;
	onChange?: () => void;
};

export default function InputCheckbox({value = false, onChange}: InputCheckboxInterface){
	return (
		<div className={value ? "checkbox-style checked" : "checkbox-style"} onClick={onChange}>
			<FaCheck className={value ? "checkbox-style-check" : "checkbox-style-uncheck"}/>
		</div>
	);
}

