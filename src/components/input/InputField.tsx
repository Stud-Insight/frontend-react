import React from "react";
import { useState } from "react";
import "./InputField.css"
import { IoEye } from "react-icons/io5";

interface InputFieldInterface {
    label?: string,
    icon?: React.ReactNode,
    is_password?: boolean,
    placeholder?: string,
    offset?: number;
    value?: string
    onChange?: (value: string) => void; 
};

export default function InputField({label, icon, value, is_password, offset = 0, onChange, placeholder = ""}: InputFieldInterface){
    const [showPassword, setShowPassword] = useState(false);

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
                type = {is_password ? (showPassword ? "text" : "password") : "text"}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            />
        </div>
    );
}