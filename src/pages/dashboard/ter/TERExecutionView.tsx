import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../hooks/AuthContext";
import UserService from "../../../services/UserService";
import GroupService, { Group, GroupStatusColor, GroupStatusLabel } from "../../../services/GroupService";
import TERService, { TERPeriod, TERPhaseColor, TERPhaseLabel } from "../../../services/TERService";
import DeliverableService, { TERDeliverableListItem } from "../../../services/DeliverableService";
import Button from "../../../atoms/input/Button";
import InfoBox from "../../../components/ui/InfoBox";
import InfoWidget from "../../../components/ui/InfoWidget";
import ContainerWidget from "../../../components/ui/ContainerWidget";
import EmptyWidget from "../../../components/ui/EmptyWidget";
import Tag from "../../../atoms/ui/Tag";
import Icon from "../../../atoms/ui/Icon";
import { FiUsers, FiRefreshCw, FiUser } from "react-icons/fi";
import { FaRegFile } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { HiOutlineCalendar } from "react-icons/hi";

import "./TERExecutionView.css";

interface TERExecutionViewProps {
    period: TERPeriod;
    setError: (error: string) => void;
    setSuccess: (success: string) => void;
};

function formatDate(dateString?: string | null): string {
    if (!dateString) {
        return "Date inconnue";
    }

    return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function getDeliverableTypeLabel(type: string): string {
    return {
        report: "Rapport",
        code: "Code source",
        presentation: "Présentation",
        other: "Autre",
    }[type] ?? type;
}

function getDeliverableTypeColor(type: string): string {
    return {
        report: "var(--blue-col)",
        code: "var(--green-col)",
        presentation: "var(--orange-col)",
        other: "var(--gray1-col)",
    }[type] ?? "var(--gray1-col)";
}

function getUploadStatusLabel(status: string): string {
    return {
        pending: "En attente",
        processing: "En cours",
        completed: "Terminé",
        failed: "Échec",
    }[status] ?? status;
}

function getUploadStatusColor(status: string): string {
    return {
        pending: "var(--orange-col)",
        processing: "var(--blue-col)",
        completed: "var(--green-col)",
        failed: "var(--red-col)",
    }[status] ?? "var(--gray1-col)";
}

export default function TERExecutionView({ period, setError, setSuccess }: TERExecutionViewProps) {
    const { user } = useAuth();
    const isStudent = user ? UserService.isStudent(user) : false;
    const [loading, setLoading] = useState(true);
    const [myGroup, setMyGroup] = useState<Group | null>(null);
    const [deliverables, setDeliverables] = useState<TERDeliverableListItem[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    void setSuccess;

    const phaseInfo = useMemo(() => TERService.getPeriodPhase(period), [period]);
    const progress = useMemo(() => {
        if (!period.project_start || !period.project_end) {
            return 0;
        }

        const start = new Date(period.project_start).getTime();
        const end = new Date(period.project_end).getTime();
        const now = Date.now();

        if (end <= start) {
            return 0;
        }

        return clamp((now - start) / (end - start), 0, 1);
    }, [period.project_start, period.project_end]);

    const loadData = async () => {
        setLoading(true);
        setErrorMessage(null);

        try {
            if (!isStudent) {
                setMyGroup(null);
                setDeliverables([]);
                return;
            }

            const group = await GroupService.getMyGroup(period.id);
            setMyGroup(group ?? null);

            if (group) {
                const files = await DeliverableService.getGroupDeliverables(group.id);
                setDeliverables(files);
            } else {
                setDeliverables([]);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur de connexion";
            setErrorMessage(message);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [period.id, isStudent]);

    const subject = myGroup?.assigned_subject ?? null;
    const leader = myGroup?.leader ?? null;
    const supervisor = subject?.supervisor ?? subject?.professor ?? null;
    const statusLabel = myGroup ? GroupStatusLabel.get(myGroup.status) ?? myGroup.status : null;

    if (loading) {
        return <span style={{ color: "var(--gray1-col)" }}>Chargement...</span>;
    }

    if (!isStudent) {
        return (
            <div className="execution-page-layout">
                <div className="dashboard-top-layout">
                    <div className="dashboard-top-title-layout">
                        <span style={{ fontWeight: "var(--big-bold)", fontSize: "25px" }}>Suivi de l'exécution</span>
                        <span style={{ color: "var(--gray1-col)" }}>{period.name}</span>
                    </div>
                </div>
                <span style={{ color: "var(--gray1-col)" }}>Cette vue est centrée sur le suivi des groupes pendant l'exécution du TER.</span>
                {errorMessage && <InfoBox label={errorMessage} type="error" />}
                <div className="dashbord-mini-info-layout">
                    <InfoWidget label="Phase" icon={<HiOutlineCalendar />} info={phaseInfo ? TERPhaseLabel.get(phaseInfo.phase) : "Inconnue"} color={phaseInfo ? TERPhaseColor.get(phaseInfo.phase) ?? "var(--blue-col)" : "var(--gray1-col)"} />
                    <InfoWidget label="Début projet" icon={<FaRegFile />} info={formatDate(period.project_start)} color="var(--blue-col)" />
                    <InfoWidget label="Fin projet" icon={<FaRegFile />} info={formatDate(period.project_end)} color="var(--green-col)" />
                </div>
                <ContainerWidget label="Aucun groupe étudiant" icon={<FiUsers />}>
                    <p style={{ margin: 0, color: "var(--gray1-col)" }}>La vue détaillée du groupe s'affiche pour les étudiants. Pour un encadrant ou un responsable, utilisez les tableaux de bord dédiés.</p>
                </ContainerWidget>
            </div>
        );
    }

    return (
        <div className="execution-page-layout">
            <div className="dashboard-top-layout">
                <div className="dashboard-top-title-layout">
                    <span style={{ fontWeight: "var(--big-bold)", fontSize: "25px" }}>Suivi de l'exécution</span>
                    <span style={{ color: "var(--gray1-col)" }}>{period.name}</span>
                </div>
                <div className="dashboard-top-button-layout">
                    <Button icon={<FiRefreshCw />} label="Actualiser" onClick={loadData} />
                </div>
            </div>

            <span style={{ color: "var(--gray1-col)" }}>Vue d'ensemble du groupe, du sujet et des livrables pendant la phase d'exécution.</span>

            {errorMessage && <InfoBox label={errorMessage} type="error" />}

            <div className="dashbord-mini-info-layout">
                <InfoWidget label="Membres" icon={<FiUsers />} info={myGroup ? `${myGroup.member_count} / ${myGroup.max_group_size}` : "0 / 0"} color="var(--blue-col)" />
                <InfoWidget label="Sujet" icon={<FaRegFile />} info={subject ? subject.title : "Aucun"} color="var(--green-col)" />
                <InfoWidget label="Livrables" icon={<LuClipboardList />} info={deliverables.length} color="var(--orange-col)" />
                <InfoWidget label="Restant" icon={<HiOutlineCalendar />} info={phaseInfo?.daysLeft ?? 0} color={phaseInfo && phaseInfo.daysLeft !== null && phaseInfo.daysLeft <= 3 ? "var(--red-col)" : "var(--blue-col)"} />
            </div>

            <div className="execution-grid">
                <ContainerWidget label="Avancement" icon={<HiOutlineCalendar />}>
                    <div className="execution-progress-card">
                        <div className="execution-progress-header">
                            <div className="execution-progress-title">
                                <span className="execution-section-label">Phase actuelle</span>
                                <span className="execution-section-value">{phaseInfo ? TERPhaseLabel.get(phaseInfo.phase) : "Phase inconnue"}</span>
                            </div>
                            {phaseInfo && <Tag label={TERPhaseLabel.get(phaseInfo.phase)} color={TERPhaseColor.get(phaseInfo.phase) ?? "var(--gray1-col)"} />}
                        </div>
                        <div className="execution-progress-bar">
                            <div className="execution-progress-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
                        </div>
                        <div className="execution-progress-footnote">
                            <span>Début: {formatDate(period.project_start)}</span>
                            <span>Fin: {formatDate(period.project_end)}</span>
                            <span>{Math.round(progress * 100)}% du projet écoulé</span>
                        </div>
                    </div>
                </ContainerWidget>

                <ContainerWidget label="Mon groupe" icon={<FiUsers />}>
                    {myGroup ? (
                        <div className="execution-meta-list">
                            <div className="execution-meta-row">
                                <span className="execution-section-label">Nom du groupe</span>
                                <span className="execution-section-value">{myGroup.name}</span>
                            </div>
                            <div className="execution-meta-row">
                                <span className="execution-section-label">Statut</span>
                                <Tag label={statusLabel ?? myGroup.status} color={GroupStatusColor.get(myGroup.status) ?? "var(--blue-col)"} />
                            </div>
                            <div className="execution-meta-row">
                                <span className="execution-section-label">Chef</span>
                                <span className="execution-section-value">{leader ? `${leader.first_name} ${leader.last_name}` : "Non défini"}</span>
                            </div>
                            <div className="execution-members-grid">
                                {myGroup.members.map(member => (
                                    <div key={member.id} className="execution-member-card">
                                        <Icon icon={<FiUser />} color="var(--blue-col)" />
                                        <div className="execution-member-text">
                                            <span>{member.first_name} {member.last_name}</span>
                                            <small>{member.email}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <EmptyWidget icon={<FiUsers size={30} />} text="Aucun groupe trouvé pour cette période." />
                    )}
                </ContainerWidget>

                <ContainerWidget label="Sujet assigné" icon={<FaRegFile />}>
                    {subject ? (
                        <div className="execution-meta-list">
                            <div className="execution-meta-row">
                                <span className="execution-section-label">Titre</span>
                                <span className="execution-section-value">{subject.title}</span>
                            </div>
                            <div className="execution-meta-row">
                                <span className="execution-section-label">Encadrant</span>
                                <span className="execution-section-value">{supervisor ? `${supervisor.first_name} ${supervisor.last_name}` : "Non défini"}</span>
                            </div>
                            <div className="execution-meta-row">
                                <span className="execution-section-label">Description</span>
                                <p className="execution-description">{subject.description}</p>
                            </div>
                        </div>
                    ) : (
                        <EmptyWidget icon={<FaRegFile size={30} />} text="Aucun sujet assigné pour le moment." />
                    )}
                </ContainerWidget>

                <ContainerWidget label="Livrables du groupe" icon={<LuClipboardList />}>
                    {deliverables.length > 0 ? (
                        <div className="deliverables-list">
                            {deliverables.map(item => (
                                <div key={item.id} className="deliverable-card">
                                    <div className="deliverable-main">
                                        <div className="deliverable-title-row">
                                            <span className="deliverable-title">{item.original_filename}</span>
                                            {item.is_confidential && <Tag label="Confidentiel" color="var(--red-col)" />}
                                        </div>
                                        <span className="deliverable-subtitle">{formatDate(item.created)} • {formatBytes(item.size)}</span>
                                    </div>
                                    <div className="deliverable-tags">
                                        <Tag label={getDeliverableTypeLabel(item.deliverable_type)} color={getDeliverableTypeColor(item.deliverable_type)} />
                                        <Tag label={getUploadStatusLabel(item.upload_status)} color={getUploadStatusColor(item.upload_status)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyWidget icon={<LuClipboardList size={30} />} text="Aucun livrable n'a encore été déposé." />
                    )}
                </ContainerWidget>
            </div>
        </div>
    );
}