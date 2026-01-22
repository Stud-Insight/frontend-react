import React from "react";
import "./HorizontalDivider.css"

interface DividerProps {
    label?: string
};

export default function HorizontalDivider({label}: DividerProps){
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