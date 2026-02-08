import React from "react";
import "./StatCard.css";

interface StatCardProps {
    label: string,
    value: string | number;
    icon: React.ReactNode;
    color?: string;
}

export default function StatCard ({label, value, icon, color = "var(--blue-col)"}: StatCardProps) {
    return (
        <div className="stat-card" style={{borderLeftColor: color}}>
            <div className="stat-icon" style={{color: color}}>
                {icon}
            </div>
            <div className="stat-info">
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
            </div>
        </div>
    );
}