import React from "react";
import { MdInfo, MdError, MdCheckCircle } from "react-icons/md";
import "./InfoBox.css";

interface InfoBoxProps {
    label: string;
    type?: "info" | "error" | "success";
}

export default function InfoBox({ label, type = "info" }: InfoBoxProps) {
    const getIcon = () => {
        switch (type) {
            case "error":
                return <MdError size={20}/>;
            case "success":
                return <MdCheckCircle size={20}/>;
            default:
                return <MdInfo size={20}/>;
        }
    };

    return (
        <div className={`info-box ${type}`}>
            <div className="info-box-icon">
                {getIcon()}
            </div>
            <label>{label}</label>
        </div>
    );
}
