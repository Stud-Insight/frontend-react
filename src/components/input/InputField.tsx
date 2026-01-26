import React from "react";
import { useState } from "react";
import "./InputField.css"
import { IoEye } from "react-icons/io5";

interface InputFieldProps {
    label?: string,
    icon?: React.ReactNode,
    placeholder?: string,
    offset?: number;
    value?: string
	type?: string;
    onChange?: (value: string) => void; 
};

export default function InputField({label, type = "text", icon, value, offset = 0, onChange, placeholder = ""}: InputFieldProps){
    return (
        <div className="input-field-container">
            {(icon || label) && (
                <div className="input-field-label">
                    {icon && (
                        <span style={{ transform: `translateY(${offset}px)` }}>
                            {icon}
                        </span>
                    )}
                    {label && <label>{label}</label>}
                </div>
            )}

            <input 
                className = "input-field" 
                value = {value ? value : ""}
                placeholder = {placeholder}
                type = {type}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            />
        </div>
    );
}