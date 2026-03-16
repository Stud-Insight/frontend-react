import React, { useState, useEffect } from "react";
import TERService, { TERStatus, EncadrantDashboard as EncadrantData, EncadrantGroup } from "../../../services/TERService";
import { GradeStatusLabel, GradeStatusColor } from "../../../services/GradeService";
import ContainerWidget from "../../../components/ui/ContainerWidget";
import InfoWidget from "../../../components/ui/InfoWidget";
import Icon from "../../../atoms/ui/Icon";
import Tag from "../../../atoms/ui/Tag";
import UserAvatar from "../../../components/ui/UserAvatar";
import { FiUsers } from "react-icons/fi";
import { TbSchool } from "react-icons/tb";
import { FaRegFile, FaRegCheckCircle } from "react-icons/fa";
import "./EncadrantDashboard.css";

export default function EncadrantDashboard() {
	const [dashboard, setDashboard] = useState<EncadrantData | null>(null);
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const encPeriods = await TERService.getEncadrantPeriods();
				const open = encPeriods.find(p => p.status === TERStatus.OPEN);
				if (open) {
					const data = await TERService.getEncadrantDashboard(open.id);
					setDashboard(data);
				}
			} catch (err) {
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			} finally {
				setLoaded(true);
			}
		};
		fetchData();
	}, []);

	if (error) {
		return <span style={{color: "var(--red-col)"}}>{error}</span>;
	}

	if (!loaded) {
		return <span style={{color: "var(--gray1-col)"}}>Chargement...</span>;
	}

	if (!dashboard || dashboard.groups.length === 0) {
		return (
			<div className="encadrant-dashboard-layout">
				{dashboard && <span style={{color: "var(--gray1-col)"}}>{dashboard.ter_period_name}</span>}
				<ContainerWidget>
					<div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "30px"}}>
						<TbSchool size={40} color="var(--gray1-col)"/>
						<span style={{fontWeight: 600}}>Aucun groupe assigne</span>
						<span style={{color: "var(--gray1-col)"}}>Vous n'avez pas encore de groupes assignes a vos sujets.</span>
					</div>
				</ContainerWidget>
			</div>
		);
	}

	return (
		<div className="encadrant-dashboard-layout">
			<span style={{color: "var(--gray1-col)"}}>{dashboard.ter_period_name}</span>

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Groupes" icon={<FiUsers/>} info={dashboard.total_groups} color="var(--blue-col)"/>
				<InfoWidget label="Notes" icon={<TbSchool/>} info={dashboard.graded_groups} color="var(--orange-col)"/>
				<InfoWidget label="Finalises" icon={<FaRegCheckCircle/>} info={dashboard.finalized_groups} color="var(--green-col)"/>
			</div>

			{dashboard.groups.map((group: EncadrantGroup) => (
				<ContainerWidget key={group.id}>
					<div className="encadrant-group-card">
						<div className="encadrant-group-header">
							<div className="encadrant-group-title">
								<span style={{fontWeight: 700, fontSize: "16px"}}>{group.name}</span>
								<span style={{color: "var(--gray1-col)", fontSize: "13px"}}>{group.subject_title}</span>
							</div>
							{group.grade_status && (
								<Tag label={GradeStatusLabel[group.grade_status] || group.grade_status}
									color={GradeStatusColor[group.grade_status] || "var(--gray1-col)"}/>
							)}
							{group.group_grade !== null && (
								<span style={{fontWeight: 800, fontSize: "18px"}}>{group.group_grade}/20</span>
							)}
						</div>

						<div className="encadrant-group-members">
							{group.members.map(member => (
								<div key={member.id} className="encadrant-member-item">
									<UserAvatar user={member} size={30}/>
									<span style={{fontSize: "13px"}}>{member.first_name} {member.last_name}</span>
								</div>
							))}
						</div>

						<div className="encadrant-group-footer">
							<div className="encadrant-deliverable-info">
								<Icon icon={<FaRegFile/>} color="var(--blue-col)"/>
								<span style={{fontSize: "13px", color: "var(--gray1-col)"}}>
									{group.deliverables.submitted}/{group.deliverables.total} livrables
								</span>
							</div>
						</div>
					</div>
				</ContainerWidget>
			))}
		</div>
	);
}
