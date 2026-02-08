import React from "react";
import StatCard from "../../components/ui/StatCard";
import ProgressBar from "../../components/ui/ProgressBar";
import { FaDownload, FaUsers, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { exportToCSV } from "../../utils/csvExports";

export default function RespoDashboard() {
    return (
        <div className="respo-dashboard-fixed">
            <header className="compact-header">
                <div>
                    <h1>Tableau de Bord</h1>
                    <p>Promotion TER 2025-2026</p>
                </div>
                <button className="compact-export-btn" onClick={() => exportToCSV([], "TER_Data")}>
                    <FaDownload /> <span>Exporter</span>
                </button>
            </header>

            <div className="dashboard-layout-stack">
                {/* Phase Card - Story 12.1 */}
                <section className="compact-phase-card">
                    <ProgressBar 
                        label="Phase : Classement des vœux" 
                        current={10} 
                        total={14} 
                        subtext="Deadline : 30 Octobre (dans 4 jours)"
                    />
                </section>

                {/* Stats Row - Story 12.2 */}
                <section className="compact-stats-grid">
                    <StatCard label="Groupes validés" value="42 / 50" icon={<FaCheckCircle />} color="#4CAF50" />
                    <StatCard label="Sujets proposés" value="65" icon={<FaUsers />} color="#2196F3" />
                    <StatCard label="Vœux en attente" value="8" icon={<FaHourglassHalf />} color="#FF9800" />
                </section>
            </div>
        </div>
    );
}