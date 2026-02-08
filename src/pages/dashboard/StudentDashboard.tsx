import React from "react";
import ProgressBar from "../../components/ui/ProgressBar";
import { FaProjectDiagram, FaUserFriends, FaCalendarCheck } from "react-icons/fa";

export default function StudentDashboard() {
    return (
        <div className="respo-dashboard-fixed"> {/* On réutilise le conteneur parent pour l'alignement */}
            <header className="compact-header">
                <div>
                    <h1>Mon Espace Étudiant</h1>
                    <p>Session 2025-2026 • <strong>Vincent Hannah</strong></p>
                </div>
                <div className="status-badge-active">En ligne</div>
            </header>

            <div className="dashboard-layout-stack">
                {/* Ligne 1 : Progression de la phase actuelle (Story 12.4) */}
                <section className="compact-phase-card student-alert-border">
                    <ProgressBar 
                        label="Temps restant pour soumettre vos vœux" 
                        current={3} 
                        total={7} 
                        subtext="Clôture le 30 Octobre à 23h59"
                    />
                </section>

                {/* Ligne 2 : Mes informations clés en mode horizontal */}
                <section className="compact-stats-grid">
                    <div className="mini-info-card">
                        <FaUserFriends className="icon-blue" />
                        <div>
                            <span className="label">Mon Groupe</span>
                            <span className="value">Groupe n°12</span>
                        </div>
                    </div>
                    
                    <div className="mini-info-card">
                        <FaProjectDiagram className="icon-green" />
                        <div>
                            <span className="label">Vœux classés</span>
                            <span className="value">3 / 5 requis</span>
                        </div>
                    </div>

                    <div className="mini-info-card clickable-card">
                        <FaCalendarCheck className="icon-orange" />
                        <div>
                            <span className="label">Prochaine étape</span>
                            <span className="value">Affectation</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}