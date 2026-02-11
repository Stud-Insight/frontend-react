import React from "react"
import "./NavigationButton.css"

interface NavigationButtonProps {
    label: string;
    icon: React.ReactNode;
    id?: string;
    offset?: number;
    size?: string;
    active?: boolean;
	notification?: number;
    onClick?: (id: string) => void;
};


export default function NavigationButton({label, icon, offset = 0, size = "20px", onClick, active = false, id = "", notification = 0}: NavigationButtonProps){
    const className = `navigation-button-style${active ? " active" : ""}`;

    return (
        <button className={className} onClick={() => onClick?.(id)}>
			<div style={{transform: `translateY(${offset}px)`, fontSize: size}}>
				{icon}
			</div>
			<label>{label}</label>

			{notification && notification > 0 ?
				<div className="navigation-button-notification-style">
					{notification}
				</div>
				:
				undefined
			}
        </button>
    )
}