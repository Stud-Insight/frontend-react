import React from "react";
import "./Divider.css"

interface DividerInterface {
    label?: string
};

export default function Divider({label}: DividerInterface){
    return label ? (
        <div className="divider-style">
            <div className="sep" />
            <span>{label}</span>
            <div className="sep" />
        </div>
    ) : (
        <div className="sep" />
    );
}