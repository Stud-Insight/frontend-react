import React from "react"
import "./NavigationButton.css"

interface NavigationButtonInterface {
    label: string;
    icon: React.ReactNode;
    offset?: number;
    size?: number;
    redirection?: string;
};

export default function NavigationButton({label, icon, offset = 0, redirection = "", size}: NavigationButtonInterface){
    return (
        <div className="navigation-button-style">
             <span style={{transform: `translateY(${offset}px)`, fontSize: `${size ? size : 20}`}}>
                {icon}
            </span>
            <label>{label}</label>
        </div>
    )
}