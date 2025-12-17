import React from "react";
import "./SubmitButton.css"

interface SubmitButtonInterface {
    label: string;
    type?: "button" | "submit";
    onChange?: () => void;
};

export default function SubmitButton({label, onChange, type = "button"}: SubmitButtonInterface){
    return (
        <button type={type} className="submit-button-style" onClick={onChange ? () => onChange() : undefined}>
            <span className="button-label">{label}</span>
        </button>
    );
}