import React, { useState, useEffect } from "react";
import TERService, { StudentDashboard, PhaseColors } from "../../../services/TERService";
import ContainerWidget from "../../../components/ui/ContainerWidget";
import Icon from "../../../atoms/ui/Icon";
import Tag from "../../../atoms/ui/Tag";
import { FiUsers } from "react-icons/fi";
import { TbSchool } from "react-icons/tb";
import { HiOutlineCalendar } from "react-icons/hi";
import { FaRegFile } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./StudentHomePage.css";

export default function StudentHomePage() {
	const [data, setData] = useState<StudentDashboard | null>(null);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await TERService.getStudentDashboard();
				setData(res);
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

	if (!data) {
		return <span style={{color: "var(--gray1-col)"}}>Chargement...</span>;
	}

	if (data.status === "no_period") {
		return (
			<ContainerWidget>
				<div className="student-home-empty">
					<TbSchool size={40} color="var(--gray1-col)"/>
					<span style={{fontWeight: 600, fontSize: "16px"}}>Aucun TER actif</span>
					<span style={{color: "var(--gray1-col)"}}>Vous n'etes inscrit a aucune periode TER en cours.</span>
				</div>
			</ContainerWidget>
		);
	}

	const phase = data.phase;
	const phaseColor = phase ? PhaseColors[phase.current_phase] || "var(--gray1-col)" : "var(--gray1-col)";

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString("fr-FR", {
			day: "2-digit", month: "long", year: "numeric"
		});
	};

	return (
		<div className="student-home-layout">
			<span style={{color: "var(--gray1-col)"}}>{data.ter_period_name}</span>

			{phase && (
				<ContainerWidget>
					<div className="student-home-phase-layout">
						<div className="student-home-phase-header">
							<Icon icon={<HiOutlineCalendar/>} color={phaseColor}/>
							<div className="student-home-phase-text">
								<span style={{fontWeight: 600}}>{phase.current_phase_label}</span>
								<Tag label={phase.current_phase_label} color={phaseColor}/>
							</div>
						</div>
						{phase.next_deadline && (
							<div className="student-home-deadline">
								<span style={{color: "var(--gray1-col)", fontSize: "14px"}}>
									{phase.next_deadline_label} : {formatDate(phase.next_deadline)}
								</span>
								{phase.days_remaining !== null && (
									<span style={{
										fontWeight: 800,
										fontSize: "20px",
										color: phase.days_remaining <= 3 ? "var(--red-col)" : "var(--black-col)"
									}}>
										{phase.days_remaining} jour{phase.days_remaining !== 1 ? "s" : ""} restant{phase.days_remaining !== 1 ? "s" : ""}
									</span>
								)}
							</div>
						)}
					</div>
				</ContainerWidget>
			)}

			<div className="dashbord-mini-info-layout">
				{data.group_name ? (
					<ContainerWidget onClick={() => data.group_id && navigate(`/dashboard/ter/${data.ter_period_id}/vote`)}>
						<div className="student-home-info-row">
							<Icon icon={<FiUsers/>} color="var(--blue-col)"/>
							<div className="student-home-info-text">
								<span style={{color: "var(--gray1-col)", fontSize: "12px"}}>Mon groupe</span>
								<span style={{fontWeight: 700}}>{data.group_name}</span>
							</div>
						</div>
					</ContainerWidget>
				) : (
					<ContainerWidget>
						<div className="student-home-info-row">
							<Icon icon={<FiUsers/>} color="var(--gray1-col)"/>
							<div className="student-home-info-text">
								<span style={{color: "var(--gray1-col)", fontSize: "12px"}}>Mon groupe</span>
								<span style={{fontWeight: 700, color: "var(--orange-col)"}}>Aucun groupe</span>
							</div>
						</div>
					</ContainerWidget>
				)}

				{data.subject_title ? (
					<ContainerWidget>
						<div className="student-home-info-row">
							<Icon icon={<FaRegFile/>} color="var(--green-col)"/>
							<div className="student-home-info-text">
								<span style={{color: "var(--gray1-col)", fontSize: "12px"}}>Mon sujet</span>
								<span style={{fontWeight: 700}}>{data.subject_title}</span>
							</div>
						</div>
					</ContainerWidget>
				) : (
					<ContainerWidget>
						<div className="student-home-info-row">
							<Icon icon={<FaRegFile/>} color="var(--gray1-col)"/>
							<div className="student-home-info-text">
								<span style={{color: "var(--gray1-col)", fontSize: "12px"}}>Mon sujet</span>
								<span style={{fontWeight: 700, color: "var(--gray1-col)"}}>Pas encore attribue</span>
							</div>
						</div>
					</ContainerWidget>
				)}
			</div>
		</div>
	);
}
