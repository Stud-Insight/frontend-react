import React from "react";
import { MdInfo, MdError, MdCheckCircle } from "react-icons/md";
import "./InfoBox.css";

interface InfoBoxInterface {
    label: string;
    type?: "info" | "error" | "success";
}

export default function InfoBox({ label, type = "info" }: InfoBoxInterface) {
    const getIcon = () => {
        switch (type) {
            case "error":
                return <MdError size={40} />;
            case "success":
                return <MdCheckCircle size={40} />;
            default:
                return <MdInfo size={40} />;
        }
    };

    return (
        <div className={`info-box info-box-${type}`}>
            {getIcon()}
            <label>{label}</label>
        </div>
    );
}
