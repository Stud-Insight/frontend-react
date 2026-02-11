import React, { ReactNode } from "react"
import "./NavigationButton.css"

interface NavigationButtonProps {
    label: string;
    icon: React.ReactNode;
    id?: string;
    offset?: number;
    size?: string;
    active?: boolean;
	notification?: number;
	children?: ReactNode;
	className?: string;
    onClick?: (id: string) => void;
};


export default function NavigationButton({label, children, icon, offset = 0, size = "20px", onClick, active = false, id = "", notification = 0, className}: NavigationButtonProps){
    const className1 = `navigation-button-style ${active ? "active" : ""} ${className}`;

    return (
        <button className={className1} onClick={() => onClick?.(id)}>
			{children == null ? 
			<>
				<div style={{transform: `translateY(${offset}px)`, fontSize: size}}>
					{icon}
				</div>
				<label>{label}</label>
			
			</>:
				children
			}
				
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