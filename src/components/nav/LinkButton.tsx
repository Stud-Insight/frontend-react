import React from "react";
import { Link } from "react-router-dom"; 
import "./LinkButton.css";

interface LinkProps {
    label: string;
    redirection: string;
    push_right?: boolean;
    push_left?: boolean;
};

export default function LinkButton({label, redirection, push_left = false, push_right = false}: LinkProps){
    return (
        <Link to={redirection} className="link-style"  style={{
                marginLeft: push_right ? "auto" : undefined,
                marginRight: push_left ? "auto" : undefined,
            }}>
            {label}
        </Link>
    );
}