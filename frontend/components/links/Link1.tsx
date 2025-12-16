import React from "react";
import { Link } from "react-router-dom"; 
import "./Link1.css";

interface LinkInterface {
    label: string;
    redirection: string;
};

export default function Link1({label, redirection}: LinkInterface){
    return (
        <Link to={redirection} className="link-style">
            {label}
        </Link>
    );
}