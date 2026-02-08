import React, { useEffect } from "react";
import "./Toast.css";

interface ToastProps {
    message: string;
    onClose: () => void;
}

export default function Toast ({message, onClose}: ToastProps) {
    useEffect( () => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="toast-notification" onClick={onClose}>
            <div className="toast-content">
                <strong> Nouvelle notification</strong>
                <p>{message}</p>
            </div>
            <div className="toast-progress-bar" />
        </div>
    ); 
}