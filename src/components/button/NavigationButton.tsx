import React, { ReactNode } from "react"
import "./NavigationButton.css"

interface NavigationButtonProps {
    label: string;
    icon: React.ReactNode;
    id?: string;
    offset?: number;
    size?: string;
    active?: boolean;
	notifCount?: number;
	children?: ReactNode;
	className?: string;
    onClick?: (id: string) => void;
};

export default function NavigationButton({label, children, icon, offset = 0, size = "20px", onClick, active = false, id = "", notifCount = 0, className}: NavigationButtonProps){
    return (
        <button className={`navigation-button-style ${active ? "active" : ""} ${className}`} onClick={() => onClick?.(id)}>
			{children == null ? 
			<>
				<div style={{transform: `translateY(${offset}px)`, fontSize: size}}>
					{icon}
				</div>
				<span>{label}</span>
			
			</>:
				children
			}
				
			{notifCount && notifCount > 0 ?
				<div className="navigation-button-notification-style">
					{notifCount}
				</div>
				:
				undefined
			}
        </button>
    )
}