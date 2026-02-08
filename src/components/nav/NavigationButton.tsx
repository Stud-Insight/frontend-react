import React from "react"
import "./NavigationButton.css"
import { IoIosArrowForward } from "react-icons/io";
import NotificationBadge from './NotificationBadge';

interface NavigationButtonInterface {
    label: string;
    icon: React.ReactNode;
    id?: string;
    offset?: number;
    size?: number;
    active?: boolean;
    onClick?: (id: string) => void;
    unreadCount?: number;
};

export default function NavigationButton({ label, icon, offset = 0, size, onClick, active = false, id = "", unreadCount = 0 }: NavigationButtonInterface) {
    const className = `navigation-button-style${active ? " active" : ""}`;

    const click_handle = () => {
        if (onClick) {
            onClick(id);
        }
    };

    return (
        <button className={className} onClick={click_handle}>
            <div className={className}>
                <span style={{
                    transform: `translateY(${offset}px)`,
                    fontSize: `${size ? size : 20}`,
                    position: 'relative', // Ajouté pour positionner le badge par rapport à l'icône
                    display: 'inline-flex'
                }}>
                    {icon}
                    {/* On affiche le badge directement sur l'icône */}
                    <NotificationBadge count={unreadCount} />
                </span>
                <label>{label}</label>
            </div>
            {active ? <IoIosArrowForward /> : undefined}
        </button>
    );
}