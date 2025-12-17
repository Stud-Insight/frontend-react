import React from "react";
import "./SubmitButton.css"

interface SubmitButtonInterface {
    label: string;
};

export default function SubmitButtonUM({label}: SubmitButtonInterface){
    return (
        <button className="submit-button-style">
            <span className="button-label">{label}</span>
            <img src="./assets/logo_um.png" alt="UM"></img>
        </button>
    );
}