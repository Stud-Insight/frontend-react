import React from "react";
import "./SubmitButton.css"
import um_logo_image from "../../assets/logo_um.png";
import { MdDangerous } from "react-icons/md";

interface SubmitButtonProps {
    label?: string;
    type?: "button" | "submit";
    style?: "default" | "um" | "cancel" | "danger";
    onChange?: () => void;
};

export default function SubmitButton({label = "button", onChange, type = "button", style = "default"}: SubmitButtonProps){
    if (style == "um"){
        return (
            <button type={type} className="submit-button-style" style={{backgroundColor: "var(--cyan-col)"}} onClick={onChange ? () => onChange() : undefined}>
                <span className="button-label">{label}</span>
                <img className="submit-button-image" src={um_logo_image} alt="um"></img>
            </button>
        );
    }

	if (style == "danger"){
        return (
            <button type={type} className="submit-button-style" style={{backgroundColor: "var(--red-col)"}} onClick={onChange ? () => onChange() : undefined}>
                <span className="button-label">{label}</span>
				<MdDangerous/>
            </button>
        );
    }

	if (style == "cancel"){
        return (
            <button type={type} className="submit-button-style" style={{backgroundColor: "var(--black-col)"}} onClick={onChange ? () => onChange() : undefined}>
                <span className="button-label">{label}</span>
            </button>
        );
    }

    if (type == "button"){
        return (
            <button type={type} className="submit-button-style" onClick={onChange ? () => onChange() : undefined}>
                <span className="button-label">{label}</span>
            </button>
        );
    }

    if (type == "submit"){
        return (
            <button type={type} className="submit-button-style">
                <span className="button-label">{label}</span>
            </button>
        );
    }
}