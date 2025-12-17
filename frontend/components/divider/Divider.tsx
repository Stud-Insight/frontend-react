import React from "react";
import "./Divider.css"

interface DividerInterface {
    label?: string
};

export default function Divider({label}: DividerInterface){
    return label ? (
        <div className="Divider-style">
            <div className="sep" />
            <label>{label}</label>
            <div className="sep" />
        </div>
    ) : (
        <div className="sep" />
    );
}