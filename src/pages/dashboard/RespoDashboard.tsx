import React, { useEffect, useState } from "react";
import { MdSchedule, MdGroups, MdPerson, MdFactCheck } from "react-icons/md";
import ContainerWidget from "../../components/ui/ContainerWidget";
import ProgressWidget from "../../components/ui/ProgressWidget";
import InfoWidget from "../../components/ui/InfoWidget";
import Infobox from "../../components/ui/Infobox";
import Icon from "../../atoms/ui/Icon";
import { DashboardService, DashboardPhase, DashboardStats } from "../../services/DashboardService";
import './RespoDashboard.css';

const RespoDashboard: React.FC = () => {
    const [phases, setPhases] = useState<DashboardPhase[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [phasesData, statsData] = await Promise.all([
                    DashboardService.getCurrentPhases(),
                    DashboardService.getStats()
                ]);
                setPhases(phasesData);
                setStats(statsData);
            } catch (error) {
                console.error("Erreur lors du chargement des données du dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div>Chargement...</div>;
    }

    const currentPhase = phases.length > 0 ? phases[0] : {
        label: loading ? "Chargement..." : "Aucune phase active",
        progress: 0
    }

    return (
        <div className="respo-dashboard-container">
            {/*Alertes de Gating*/}
            {stats && stats.solitaires > 0 && (
                <Infobox
                    label={`Action requise : ${stats.solitaires} étudiants sans groupe.`}
                    type="error"
                />
            )}

            {/*Phase actuelle et progression*/}
            <ContainerWidget
                label="Suivi du Workflow"
                icon={<Icon icon={<MdSchedule />} color="var(--primary-col)" />}
                className={loading ? "skeleton" : ""}
            >
                <ProgressWidget
                    label={currentPhase.label}
                    progress={currentPhase.progress}
                />
            </ContainerWidget>

            {/* Statistique en temps réel */}
            <div className={`stats-widgets-grid ${loading ? "skeleton-grid" : ""}`}>
                <InfoWidget
                    label="Groupes Formés"
                    info={stats ? `${stats.groupsFormed}/${stats.totalGroupsExpected}` : "-- / --"}
                    icon={<MdGroups />}
                    color="var(--blue-col)"
                />
                <InfoWidget
                    label="Solitaires"
                    info={stats ? stats.solitaires : "0"}
                    icon={<MdPerson />}
                    color="var(--red-col)"
                />
                <InfoWidget
                    label="Vœux Validés"
                    info={stats ? stats.rankingsDone : "0"}
                    icon={<MdFactCheck />}
                    color="var(--green-col)"
                />
            </div>
        </div >
    );
};

export default RespoDashboard;