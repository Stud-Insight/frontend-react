import React, { useState, useEffect } from "react";
import TERService, { TERPeriod, TERPeriodStats } from "../../services/TERService";
import './RespoDashboard.css';

export default function RespoDashboard() {
    const [periods, setPeriods] = useState<TERPeriod | null>(null);
    const [stats, setStats] = useState<TERPeriodStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const id = "current";

        const loadInitialData = async () => {
            try {
                const [fetchedPeriods, fetchedStats] = await Promise.all([
                    TERService.getPeriod(id),
                    TERService.getPeriodStats(id)
                ]);
                if (isMounted) {
                    setPeriods(fetchedPeriods);
                    setStats(fetchedStats);
                }
            } catch (err) {
                console.error("Erreur lors du chargement des données du dashboard:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadInitialData();

        const unsubscribe = TERService.subscribeToStats(id, (updatedStats) => {
            if (!isMounted) return;
            setStats(prev => prev ? { ...prev, ...updatedStats } : null);
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    if (loading) return <div className="dashboard-loading"><p>Chargement des indicateurs...</p></div>;
    if (!stats || !periods) return null;

    const progress = (() => {
        const startDate = new Date(periods.group_formation_start).getTime();
        const endDate = new Date(periods.group_formation_end).getTime();
        const now = new Date().getTime();
        if (now < startDate) return 0;
        if (now > endDate) return 100;
        return Math.round(((now - startDate) / (endDate - startDate)) * 100);
    })();

    return (
        <div className="respo-dashboard-content">
            <h2>Dashboard Responsable</h2>

            {stats.subjects_validated < stats.subjects_total && (
                <div className="validation-warning">
                    <span className="warning-icon">⚠️</span>
                    <div className="text">
                        <h4>Invitation étudiants bloquée</h4>
                        <p>Il reste des sujets à valider ({stats.subjects_validated} / {stats.subjects_total}).</p>
                    </div>
                </div>
            )}

            <div className="phase-card">
                <div className="phase-info">
                    <h3>Phase actuelle : {periods?.name || "Formation des groupes"}</h3>
                    <span className="progress-text">{progress}%</span>
                </div>
                <p className="dates">Du {new Date(periods.group_formation_start).toLocaleDateString()} au {new Date(periods.group_formation_end).toLocaleDateString()}</p>
                <div className="progress-bar-bg">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="metrics-grid">
                <div className="metric-card">
                    <h4>Étudiants inscrits</h4>
                    <p className="value">{stats.students_enrolled}</p>
                </div>

                <div className={`metric-card ${stats.students_solitaires > 0 ? 'alert' : ''}`}>
                    <h4>Solitaires</h4>
                    <p className="value">{stats.students_solitaires}</p>
                </div>

                <div className="metric-card">
                    <h4>Groupes Formés</h4>
                    <p className="value">{stats.groups_total}</p>
                </div>

                <div className="metric-card">
                    <h4>Groupes Complets</h4>
                    <p className="value">{stats.groups_complete}</p>
                </div>

                <div className="metric-card">
                    <h4>Sujets Validés</h4>
                    <p className="value">{stats.subjects_validated} / {stats.subjects_total}</p>
                </div>
            </div>
        </div>
    );
}