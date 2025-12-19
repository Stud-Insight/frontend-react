import React from "react"
import "./NavigationButton.css"
import { IoIosArrowForward } from "react-icons/io";

interface NavigationButtonInterface {
    label: string;
    icon: React.ReactNode;
    id?: string;
    offset?: number;
    size?: number;
    active?: boolean;
    onClick?: (id: string) => void;
};

export default function NavigationButton({label, icon, offset = 0, size, onClick, active = false, id = ""}: NavigationButtonInterface){
    const className = `navigation-button-style${active ? " active" : ""}`;

    const click_handle = () => {
        if (onClick){
            onClick(id);
        }
    };

    return (
        <button className={className} onClick={click_handle}>
            <div className={className}>
                <span style={{transform: `translateY(${offset}px)`, fontSize: `${size ? size : 20}`}}>
                    {icon}
                </span>
                <label>{label}</label>
            </div>

            {active ? <IoIosArrowForward/> : undefined}
        </button>
    )
}