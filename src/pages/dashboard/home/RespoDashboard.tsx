import React, { useState, useEffect } from 'react';
import TERService, { TERPeriod, TERPeriodStats, TERStatus, TERStatusColor, AdminSystemStats } from '../../../services/TERService';
import InfoWidget from '../../../components/ui/InfoWidget';
import ContainerWidget from '../../../components/ui/ContainerWidget';
import { FiUsers, FiUser } from 'react-icons/fi';
import { TbSchool } from 'react-icons/tb';
import { FaRegFile } from 'react-icons/fa';
import { MdWorkOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import './RespoDashboard.css';

export default function RespoDashboard() {
	const [periods, setPeriods] = useState<TERPeriod[]>([]);
	const [activePeriod, setActivePeriod] = useState<TERPeriod | null>(null);
	const [stats, setStats] = useState<TERPeriodStats | null>(null);
	const [adminStats, setAdminStats] = useState<AdminSystemStats | null>(null);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [allPeriods, sysStats] = await Promise.all([
					TERService.getPeriods(),
					TERService.getAdminStats(),
				]);
				setPeriods(allPeriods);
				setAdminStats(sysStats);

				const open = allPeriods.find(p => p.status === TERStatus.OPEN);
				if (open) {
					setActivePeriod(open);
					const periodStats = await TERService.getPeriodStats(open.id);
					setStats(periodStats);
				}
			} catch (err) {
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		};
		fetchData();
	}, []);

	if (error) {
		return <span style={{color: "var(--red-col)"}}>{error}</span>;
	}

	return (
		<div className="respo-dashboard-layout">
			{adminStats && (
				<>
					<span style={{color: "var(--gray1-col)"}}>Vue d'ensemble du systeme</span>
					<div className="dashbord-mini-info-layout">
						<InfoWidget label="Utilisateurs" icon={<FiUser/>} info={adminStats.active_users} color="var(--blue-col)"/>
						<InfoWidget label="Etudiants" icon={<FiUsers/>} info={adminStats.total_students} color="var(--blue-col)"/>
						<InfoWidget label="Encadrants" icon={<TbSchool/>} info={adminStats.total_encadrants} color="var(--purple-col)"/>
					</div>
					<div className="dashbord-mini-info-layout">
						<InfoWidget label="TER Actifs" icon={<TbSchool/>} info={adminStats.active_ter_periods} color={TERStatusColor.get(TERStatus.OPEN)}/>
						<InfoWidget label="TER Brouillon" icon={<TbSchool/>} info={adminStats.draft_ter_periods} color={TERStatusColor.get(TERStatus.DRAFT)}/>
						<InfoWidget label="Stages Actifs" icon={<MdWorkOutline/>} info={adminStats.active_stage_periods} color="var(--green-col)"/>
					</div>
				</>
			)}

			{/* {activePeriod && stats && (
				<>
					<div className="dashboard-top-layout" style={{marginTop: "10px"}}>
						<span style={{fontWeight: 700, fontSize: "18px"}}>
							{activePeriod.name}
						</span>
					</div>
					<span style={{color: "var(--gray1-col)"}}>Statistiques de la periode TER active</span>

					<div className="dashbord-mini-info-layout">
						<InfoWidget label="Inscrits" icon={<FiUsers/>} info={stats.students_enrolled} color="var(--blue-col)"
							onClick={() => navigate(`/dashboard/ter/${activePeriod.id}/admin`)}/>
						<InfoWidget label="En groupe" icon={<FiUsers/>} info={stats.students_in_groups} color="var(--green-col)"/>
						<InfoWidget label="Solitaires" icon={<FiUser/>} info={stats.students_solitaires}
							color={stats.students_solitaires > 0 ? "var(--red-col)" : "var(--green-col)"}/>
					</div>

					<div className="dashbord-mini-info-layout">
						<InfoWidget label="Groupes" icon={<FiUsers/>} info={stats.groups_total} color="var(--blue-col)"/>
						<InfoWidget label="Sujets Valides" icon={<FaRegFile/>} info={stats.subjects_validated} color="var(--orange-col)"/>
						<InfoWidget label="Affectes" icon={<FaRegFile/>} info={stats.groups_assigned} color="var(--green-col)"/>
					</div>
				</>
			)}

			{!activePeriod && (
				<ContainerWidget>
					<div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "30px"}}>
						<TbSchool size={40} color="var(--gray1-col)"/>
						<span style={{fontWeight: 600}}>Aucun TER actif</span>
						<span style={{color: "var(--gray1-col)"}}>Creez ou ouvrez une periode TER depuis la gestion TER.</span>
					</div>
				</ContainerWidget>
			)} */}
		</div>
	);
}
