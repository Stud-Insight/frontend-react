import React, { useEffect, useMemo, useState } from "react";
import GroupService, { Group, GroupStatusLabel } from "../../services/GroupService";
import TERService, { TERPeriod } from "../../services/TERService";
import { User } from "../../services/UserService";
import { useAuth } from "../../hooks/AuthContext";
import DashboardPage from "../dashboard/DashboardPage";
import Button from "../../atoms/input/Button";
import InfoBox from "../../components/ui/InfoBox";
import ContainerWidget from "../../components/ui/ContainerWidget";
import InfoWidget from "../../components/ui/InfoWidget";
import { FiUsers, FiMail, FiHash } from "react-icons/fi";
import { FaRegFile } from "react-icons/fa";
import "./MyGroupPage.css";

interface MyGroupPageProps {
    showDashboard?: boolean;
    period?: TERPeriod | null;
    group?: Group | null;
}

function getUserLabel(user: User): string {
    const firstName = user.first_name ?? "";
    const lastName = user.last_name ?? "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName.length > 0 ? fullName : user.email;
}

function getStatusColor(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes("valid")) return "var(--green-col)";
    if (normalized.includes("attente") || normalized.includes("pending")) return "var(--orange-col)";
    if (normalized.includes("rej") || normalized.includes("refus")) return "var(--red-col)";
    return "var(--blue-col)";
}

export default function MyGroupPage({ showDashboard = true, period: propPeriod, group: propGroup }: MyGroupPageProps = {}) {
    const { user } = useAuth();
    const [period, setPeriod] = useState<TERPeriod | null>(null);
    const [myGroup, setMyGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            const periods = await TERService.getMyPeriods();
            const currentPeriod = periods[0];
            if (!currentPeriod) {
                setPeriod(null);
                setMyGroup(null);
                return;
            }
            setPeriod(currentPeriod);
            try {
                const group = await GroupService.getMyGroup(currentPeriod.id);
                setMyGroup(group ?? null);
            } catch {
                setMyGroup(null);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur de connexion";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    useEffect(() => {
        if (propPeriod) setPeriod(propPeriod);
        if (propGroup) setMyGroup(propGroup);
        if (propPeriod) setLoading(false);
    }, [propPeriod, propGroup]);

    const leaderId = myGroup?.leader?.id;
    const isLeader = useMemo(() => user && leaderId ? user.id === leaderId : false, [user, leaderId]);
    const supervisor = myGroup?.assigned_subject?.supervisor ?? myGroup?.assigned_subject?.professor;
    const projectTitle = myGroup?.assigned_subject?.title;
    const projectDescription = myGroup?.assigned_subject?.description;
    const membersLeft = myGroup ? Math.max(myGroup.max_group_size - myGroup.member_count, 0) : 0;

    const copyGroupCode = async () => {
        if (!myGroup?.id) return;
        try {
            await navigator.clipboard.writeText(myGroup.id);
            setSuccess("Identifiant du groupe copié.");
            setTimeout(() => setSuccess(""), 3000);
        } catch {
            setError("Impossible de copier l'identifiant.");
        }
    };

    if (loading) return (
        showDashboard ? (
            <DashboardPage>
                <ContainerWidget>
                    <div className="my-group-empty-state">Chargement...</div>
                </ContainerWidget>
            </DashboardPage>
        ) : (
            <ContainerWidget>
                <div className="my-group-empty-state">Chargement...</div>
            </ContainerWidget>
        )
    );

    if (!period || !myGroup) {
        return (
            showDashboard ? (
                <DashboardPage>
                    <ContainerWidget>
                        <div className="my-group-empty-state">
                            <h2>Mon groupe</h2>
                            <p>Aucun groupe trouvé pour la période actuelle.</p>
                        </div>
                    </ContainerWidget>
                </DashboardPage>
            ) : (
                <ContainerWidget>
                    <div className="my-group-empty-state">
                        <h2>Mon groupe</h2>
                        <p>Aucun groupe trouvé pour la période actuelle.</p>
                    </div>
                </ContainerWidget>
            )
        );
    }

    const statusLabel = GroupStatusLabel.get(myGroup.status) ?? myGroup.status;

    const pageContent = (
        <div className="my-group-page-layout">
            <div className="dashboard-top-layout">
                <div className="dashboard-top-title-layout">
                    <span style={{ fontWeight: "var(--big-bold)", fontSize: "25px" }}>Mon groupe</span>
                    <span style={{ color: "var(--gray1-col)" }}>{period.name}</span>
                </div>
            </div>

            <span style={{ color: "var(--gray1-col)" }}>Vue d'ensemble du groupe, des membres et du projet associé.</span>

            {error && <InfoBox label={error} type="error" />}
            {success && <InfoBox label={success} type="success" />}

            <div className="dashbord-mini-info-layout">
                <InfoWidget
                    label="Membres"
                    icon={<FiUsers />}
                    info={`${myGroup.member_count} / ${myGroup.max_group_size}`}
                    color="var(--blue-col)"
                />
                <InfoWidget
                    label="Statut"
                    icon={<FaRegFile />}
                    info={statusLabel}
                    color={getStatusColor(statusLabel)}
                />
            </div>

            <div className="my-group-sections-grid">
                <ContainerWidget label="Informations générales" icon={<FiHash />}>
                    <div className="my-group-meta-list">
                        <div className="my-group-meta-row">
                            <span className="my-group-meta-label">Nom du groupe</span>
                            <span className="my-group-meta-value">{myGroup.name}</span>
                        </div>
                        <div className="my-group-meta-row">
                            <span className="my-group-meta-label">Type de projet</span>
                            <span className="my-group-meta-value">{myGroup.project_type}</span>
                        </div>
                        <div className="my-group-meta-row">
                            <span className="my-group-meta-label">Période</span>
                            <span className="my-group-meta-value">{period.name}</span>
                        </div>
                        <div className="my-group-meta-row">
                            <span className="my-group-meta-label">Chef de groupe</span>
                            <span className="my-group-meta-value">
                                {myGroup.leader ? getUserLabel(myGroup.leader) : "Non défini"}
                                {isLeader ? " (vous)" : ""}
                            </span>
                        </div>
                        <div className="group-id-row">
                            <div className="my-group-meta-row">
                                <span className="my-group-meta-label">Identifiant groupe</span>
                                <span className="my-group-meta-value my-group-code">{myGroup.id}</span>
                            </div>
                            <Button label="Copier" height={30} onClick={copyGroupCode} />
                        </div>
                    </div>
                </ContainerWidget>

                <ContainerWidget label="Membres" icon={<FiUsers />}>
                    <div className="members-grid">
                        {myGroup.members.map((member) => (
                            <div key={member.id} className="member-card">
                                <div className="member-name">
                                    {getUserLabel(member)}
                                    {myGroup.leader?.id === member.id ? " - Chef" : ""}
                                    {user?.id === member.id ? " (vous)" : ""}
                                </div>
                                <div className="member-email">{member.email}</div>
                            </div>
                        ))}
                    </div>
                </ContainerWidget>

                <ContainerWidget label="Encadrant" icon={<FiMail />}>
                    {supervisor ? (
                        <div className="my-group-meta-list">
                            <div className="my-group-meta-row">
                                <span className="my-group-meta-label">Nom</span>
                                <span className="my-group-meta-value">{getUserLabel(supervisor)}</span>
                            </div>
                            <div className="my-group-meta-row">
                                <span className="my-group-meta-label">Email</span>
                                <span className="my-group-meta-value">{supervisor.email}</span>
                            </div>
                            <div className="my-group-action-row">
                                <Button icon={<FiMail />} label="Contacter" onClick={() => window.location.href = `mailto:${supervisor.email}`} />
                            </div>
                        </div>
                    ) : (
                        <p className="my-group-muted-text">Aucun encadrant assigné.</p>
                    )}
                </ContainerWidget>

                <ContainerWidget label="Projet" icon={<FaRegFile />}>
                    {projectTitle ? (
                        <div className="my-group-meta-list">
                            <div className="my-group-meta-row">
                                <span className="my-group-meta-label">Titre</span>
                                <span className="my-group-meta-value">{projectTitle}</span>
                            </div>
                            <div className="my-group-project-description">
                                <span className="my-group-meta-label">Description</span>
                                <p>{projectDescription || "Aucune description."}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="my-group-muted-text">Aucun projet associé.</p>
                    )}
                </ContainerWidget>
            </div>
        </div>
    );

    return showDashboard ? <DashboardPage>{pageContent}</DashboardPage> : pageContent;
}