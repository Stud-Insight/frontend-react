import React from "react";
import "./Separator.css"

interface SeparatorInterface {
    label?: string
};

export default function Separator({label}: SeparatorInterface){
    return label ? (
        <div className="separator-style">
            <div className="sep" />
            <label>{label}</label>
            <div className="sep" />
        </div>
    ) : (
        <div className="sep" />
    );
}