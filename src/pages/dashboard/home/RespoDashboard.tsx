import React, { useState, useEffect } from 'react';
// import api from '../../api/ApiHandle';
import './RespoDashboard.css'

interface DashboardData {
    currentPhase: {
        label: string;
        dates: string;
        progress: number;
    };
    metrics: {
        groupFormed: number;
        totalGroups: number;
        solitaires: number;
        incompleteGroups: number;
        rankingsCompleted: number;
        all_subjects_validated: boolean;
        validatedSubjects: number;
        totalSubjects: number;
    };
}

interface GatingConditions {
    all_subjects_validated: boolean;
    missing_subjects_count: number;
    can_invite_students: boolean;
}

export default function RespoDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await api.get<DashboardData>("ter/dashboard-metrics/");
    //             setData(response.data);
    //         } catch (err) {
    //             console.error("Erreur lors du chargement du dashboard:", err);
    //             setError("Impossible de charger les données du dashboard.");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();

    //     const apiUrl = process.env.API_URL || "http://localhost:8000";
    //     const eventSource = new EventSource(`${apiUrl}/api/ter/stats-stream`, { withCredentials: true });

    //     eventSource.onmessage = (event) => {
    //         const updatedMetrics = JSON.parse(event.data);
    //         setData(prevData => prevData ? { ...prevData, metrics: { ...prevData.metrics, ...updatedMetrics } } : null);
    //     };

    //     return () => eventSource.close();
    // }, []);

    if (loading) {
        return <div className='dashboard-container'>Chargement...</div>;
    }
	
    if (error) {
        return <div className='dashboard-container error'>{error}</div>;
    }

    if (!data) return null;

    return (
        <div className='dashboard-container'>
            <h2>Dashboard Responsable</h2>
            {!data.metrics.all_subjects_validated && (
                <div className='gating-warning-banner'>
                    <div className='warning-icon'>⚠️</div>
                    <div className='warning-content'>
                        <h4>Action bloquée: Invitation des étudiants</h4>
                        <p>Vous ne pouvez pas inviter d'étudiants tant que tous les sujets ne sont pas validés ({data.metrics.validatedSubjects}/{data.metrics.totalSubjects}).</p>
                    </div>
                </div>
            )}
            <div className='current-phase'>
                <h3>Phase actuelle: {data?.currentPhase.label}</h3>
                <p>{data?.currentPhase.dates}</p>
                <div className='progress-bar'>
                    <div className='progress' style={{ width: `${data?.currentPhase.progress}%` }}></div>
                </div>
            </div>
            <div className='metrics'>
                <div className={`metric-card ${data.metrics.solitaires > 0 ? 'urgent' : ''}`}>
                    <h4>Solitaires</h4>
                    <p>{data?.metrics.solitaires}</p>
                    {data.metrics.solitaires > 0 && <span className='warning-label'>Attention: {data.metrics.solitaires} solitaires!</span>}
                </div>
                <div className={`metric-card ${data.metrics.incompleteGroups > 0 ? 'warning' : ''}`}>
                    <h4>Groupes incomplets</h4>
                    <p>{data?.metrics.incompleteGroups}</p>
                    {data.metrics.incompleteGroups > 0 && <span className='warning-label'>Il y a {data.metrics.incompleteGroups} groupes incomplets.</span>}
                </div>
                <div className='metric-card'>
                    <h4>Groupes formés</h4>
                    <p>{data?.metrics.groupFormed}</p>
                </div>
                <div className='metric-card'>
                    <h4>Total groupes</h4>
                    <p>{data?.metrics.totalGroups}</p>
                </div>
                <div className='metric-card'>
                    <h4>Solitaires</h4>
                    <p>{data?.metrics.solitaires}</p>
                </div>
                <div className='metric-card'>
                    <h4>Groupes incomplets</h4>
                    <p>{data?.metrics.incompleteGroups}</p>
                </div>
                <div className='metric-card'>
                    <h4>Classements complétés</h4>
                    <p>{data?.metrics.rankingsCompleted}</p>
                </div>
            </div>
        </div>
    );
}

