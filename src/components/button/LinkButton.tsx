import React from "react";
import { Link } from "react-router-dom"; 
import "./LinkButton.css";

interface LinkButtonProps {
    label: string;
    redirection?: string;
	onClick?: () => void;
};

export default function LinkButton({label, redirection, onClick}: LinkButtonProps){
    return (
        <Link to={redirection} className="link-style" onClick={onClick}>
            {label}
        </Link>
    );
}