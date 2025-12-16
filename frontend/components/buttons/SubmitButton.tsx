import React from "react";
import "./SubmitButton.css"

interface SubmitButtonInterface {
    label: string;
};

export default function SubmitButton({label}: SubmitButtonInterface){
    return (
        <button className="submit-button-style">
            <span className="button-label">{label}</span>
        </button>
    );
}