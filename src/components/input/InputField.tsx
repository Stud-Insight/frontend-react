import React, { ReactNode, useRef } from "react";
import Field from "../../atoms/input/Field";
import "./InputField.css"

interface InputFieldProps {
    label?: string,
    icon?: ReactNode,
    placeholder?: string,
    value?: string
	type?: string;
    onChange?: (value: string) => void; 
};

export default function InputField({label, type = "text", icon, value, onChange, placeholder = ""}: InputFieldProps){
	const inputRef = useRef<HTMLInputElement | null>(null);	

	const pressHandle = () => {
		inputRef.current?.focus();
	};

    return (
		<Field label={label} icon={icon} onClick={pressHandle}>
			<input ref={inputRef} value={value} placeholder={placeholder} type={type} onChange={onChange ? (e) => onChange(e.target.value) : undefined}/>
		</Field>
    );
}
