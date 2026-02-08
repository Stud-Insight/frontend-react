import React from "react"
import "./ProgressBar.css";

interface ProgressBarProps {
    label: string;
    current: number;
    total: number;
    subtext?: string;
}

export default function ProgressBar ({label, current, total, subtext}: ProgressBarProps) {
    const percentage= Math.min(Math.round((current/total) * 100), 100);

    return ( 
        <div className="progress-widget">
            <div className="progress-info">
                <span className="progress-label">{label}</span>
                <span className="progress-count">{current} / {total} jours </span>
            </div>
            <div className="progress-bar-bg">
                <div 
                    className="progress-bar-fill"
                    style= {{ width: `${percentage}%`}}
                ></div>
            </div>
            {subtext && <p className="progress-subtext"> {subtext}</p>}
        </div>
    );
}