import React from "react";
import "./SubmitButton.css"
import um_logo_image from "../../assets/logo_um.png";

interface SubmitButtonInterface {
    label: string;
    type?: "button" | "submit";
    style?: "default" | "um";
    onChange?: () => void;
};

export default function SubmitButton({label, onChange, type = "button", style = "default"}: SubmitButtonInterface){
    if (style == "um"){
        return (
            <button type={type} className="submit-button-style" style={{backgroundColor: "var(--cyan-col)"}} onClick={onChange ? () => onChange() : undefined}>
                <span className="button-label">{label}</span>
                <img src={um_logo_image} alt="um"></img>
            </button>
        );
    }

    return (
        <button type={type} className="submit-button-style" onClick={onChange ? () => onChange() : undefined}>
            <span className="button-label">{label}</span>
        </button>
    );
}