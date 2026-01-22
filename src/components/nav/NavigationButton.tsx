import React from "react"
import "./NavigationButton.css"

interface NavigationButtonProps {
    label: string;
    icon: React.ReactNode;
    id?: string;
    offset?: number;
    size?: number;
    active?: boolean;
    onClick?: (id: string) => void;
};


export default function NavigationButton({label, icon, offset = 0, size, onClick, active = false, id = ""}: NavigationButtonProps){
    const className = `navigation-button-style${active ? " active" : ""}`;

    const click_handle = () => {
        if (onClick){
            onClick(id);
        }
    };

    return (
        <button className={className} onClick={click_handle}>
            <span style={{transform: `translateY(${offset}px)`, fontSize: `${size ? size : 20}`}}>
				{icon}
			</span>
			<label>{label}</label>
        </button>
    )
}