import React from "react";
import "./HorizontalDivider.css"

interface DividerInterface {
    label?: string
};

export default function HorizontalDivider({label}: DividerInterface){
    return label ? (
        <div className="divider-style">
            <div className="sep" />
            <label>{label}</label>
            <div className="sep" />
        </div>
    ) : (
        <div className="sep" />
    );
}