import React, {useState } from "react";
import { FaCheck } from "react-icons/fa6";

import "./InputCheckbox.css"

interface InputCheckboxProps {
	value?: boolean;
	onChange?: () => void;
};

export default function InputCheckbox({value = false, onChange}: InputCheckboxProps){
	return (
		<div className={value ? "checkbox-style checked" : "checkbox-style"} onClick={onChange}>
			<FaCheck className={value ? "checkbox-style-check" : "checkbox-style-uncheck"}/>
		</div>
	);
}

