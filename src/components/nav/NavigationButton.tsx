import React from "react"
import "./NavigationButton.css"

interface NavigationButtonProps {
    label: string;
    icon: React.ReactNode;
    id?: string;
    offset?: number;
    size?: number;
    active?: boolean;
	showBackground?: boolean;
    onClick?: (id: string) => void;
};


export default function NavigationButton({label, icon, offset = 0, size, onClick, active = false, id = "", showBackground = false}: NavigationButtonProps){
    const className = `navigation-button-style${active ? " active" : ""}`;

    const clickHandle = () => {
        onClick ? onClick(id) : undefined;
    };

    return (
        <button className={className} onClick={clickHandle} style={{backgroundColor: showBackground && !active ? "var(--gray3-col)" : undefined}}>
            <span style={{transform: `translateY(${offset}px)`, fontSize: `${size ? size : 20}`}}>
				{icon}
			</span>
			<label>{label}</label>
        </button>
    )
}