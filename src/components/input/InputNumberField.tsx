import React, { ReactNode, useEffect } from "react";
import Field from "../../atoms/input/Field";
import IconButton from "../button/IconButton";

import { FaPlus, FaMinus } from "react-icons/fa6";

interface InputNumberFieldProps {
	value: number;
	label?: string,
	icon?: ReactNode,
	placeholder?: string,
	defaultNum?: number;
	min?: number;
	max?: number;
	step?: number;
	onChange?: (n: number) => void;
};

export default function InputNumberField({label, icon, value, defaultNum = 0, placeholder, min = -20, max = 20, step = 1, onChange}: InputNumberFieldProps){
	const incrementHandle = () => {
		if (value < max){
			onChange ? onChange(value + step) : undefined;	
		}
	}

	const decrementHandle = () => {
		if (value > min){
			onChange ? onChange(value - step) : undefined;
		}	
	}

	useEffect(() => {
		defaultNum && (onChange ? onChange(defaultNum) : undefined);
	}, []);

	return (
		<Field label={label} icon={icon} className="number-field-layout">
			<input readOnly value={value} placeholder={placeholder}/>
			<IconButton icon={<FaMinus/>} onClick={decrementHandle}/>
			<IconButton icon={<FaPlus/>} onClick={incrementHandle}/>
		</Field>
	)
}