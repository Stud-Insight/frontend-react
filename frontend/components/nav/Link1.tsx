import React from "react";
import { Link } from "react-router-dom"; 
import "./Link1.css";

interface LinkInterface {
    label: string;
    redirection: string;
    push_right?: boolean;
    push_left?: boolean;
};

export default function Link1({label, redirection, push_left = false, push_right = false}: LinkInterface){
    return (
        <Link to={redirection} className="link-style"  style={{
                marginLeft: push_right ? "auto" : undefined,
                marginRight: push_left ? "auto" : undefined,
            }}>
            {label}
        </Link>
    );
}