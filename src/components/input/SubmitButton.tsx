import React, {ReactNode} from "react";
import "./SubmitButton.css"
import um_logo_image from "../../assets/logo_um.png";
import { MdDangerous } from "react-icons/md";

interface SubmitButtonProps {
    label?: string;
	icon?: ReactNode;
    type?: "button" | "submit";
    style?: "default" | "um" | "cancel" | "danger";
    onChange?: () => void;
};

export default function SubmitButton({icon, label = "button", onChange, type = "button", style = "default"}: SubmitButtonProps){
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
            <button type={type} className="submit-button-style" style={{backgroundColor: "var(--gray1-col)"}} onClick={onChange ? () => onChange() : undefined}>
				{icon}
                <span className="button-label">{label}</span>
            </button>
        );
    }

    if (type == "button"){
        return (
            <button type={type} className="submit-button-style" onClick={onChange ? () => onChange() : undefined}>
				{icon}
                <span className="button-label">{label}</span>
            </button>
        );
    }

    if (type == "submit"){
        return (
            <button type={type} className="submit-button-style">
				{icon}
                <span className="button-label">{label}</span>
            </button>
        );
    }
}