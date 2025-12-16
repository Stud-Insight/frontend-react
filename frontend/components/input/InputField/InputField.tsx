import React from "react";
import { useState } from "react";
import "./InputField.css"
import { IoEye } from "react-icons/io5";

interface InputFieldInterface {
    label: string,
    icon: React.ReactNode,
    password_type: boolean,
};

export default function InputField({label, icon, password_type}: InputFieldInterface){
    const [showPassword, setShowPassword] = useState(true);

    return (
        <div className="input-field-container">
            <div className="input-field-label">
                {icon}
                <label>{label}</label>
            </div>

            <input className="input-field" type={password_type && showPassword ? "text" : "password"}/>
        </div>
    );
}