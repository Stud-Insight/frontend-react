import React from "react";
import "./SubmitButton.css"

interface SubmitButtonInterface {
    label: string;
    icon_path?: string;
};

export default function SubmitButton({label, icon_path}: SubmitButtonInterface){
    return (
        <button className="button-style">
            {icon_path && (<img src={icon_path} className="button-image"/>)}
            <span className="button-label">{label}</span>
        </button>
    );
}