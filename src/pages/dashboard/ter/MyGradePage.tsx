import React, { useState, useEffect } from "react";
import DashboardPage from "../DashboardPage";
import GradeService, { MyGrade, GroupGrade } from "../../../services/GradeService";
import GroupService, { Group } from "../../../services/GroupService";
import TERService, { TERPeriod, TERStatus } from "../../../services/TERService";
import ContainerWidget from "../../../components/ui/ContainerWidget";
import InfoBox from "../../../components/ui/InfoBox";
import Button from "../../../atoms/input/Button";
import Tag from "../../../atoms/ui/Tag";

import { TbSchool } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { FaRegCheckCircle } from "react-icons/fa";

import "./MyGradePage.css";

export default function MyGradePage() {
	const [period, setPeriod] = useState<TERPeriod | null>(null);
	const [group, setGroup] = useState<Group | null>(null);
	const [groupGrade, setGroupGrade] = useState<GroupGrade | null>(null);
	const [myGrade, setMyGrade] = useState<MyGrade | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [loaded, setLoaded] = useState<boolean>(false);

	const fetchAll = async () => {
		try {
			const periods = await TERService.getMyPeriods();
			const active = periods.find(p => p.status === TERStatus.OPEN) ?? periods[0] ?? null;
			setPeriod(active);

			if (!active) {
				setLoaded(true);
				return;
			}

			const g = await GroupService.getMyGroup(active.id);
			setGroup(g);

			if (g) {
				const [gg, mg] = await Promise.all([
					GradeService.getGroupGrade(g.id),
					GradeService.getMyGrade(active.id),
				]);
				setGroupGrade(gg);
				setMyGrade(mg);
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		} finally {
			setLoaded(true);
		}
	};

	useEffect(() => {
		fetchAll();
	}, []);

	const optInHandle = async () => {
		if (!group) return;
		try {
			const res = await GradeService.optInIndividualGrading(group.id);
			if (res?.success) {
				setSuccess("Vous avez demandé à être noté individuellement.");
				setTimeout(() => setSuccess(null), 5000);
				fetchAll();
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{ fontWeight: "var(--big-bold)", fontSize: "25px" }}>Mes notes</span>
				</div>
			</div>

			<span style={{ color: "var(--gray1-col)" }}>Consultez vos notes TER et gérez votre notation individuelle.</span>

			{error && <InfoBox label={error} type="error" />}
			{success && <InfoBox label={success} type="success" />}

			{!loaded && <span style={{ color: "var(--gray1-col)" }}>Chargement...</span>}

			{loaded && !period && (
				<InfoBox label="Aucune période TER active." type="info" />
			)}

			{loaded && period && !group && (
				<InfoBox label="Vous n'êtes membre d'aucun groupe sur cette période." type="info" />
			)}

			{loaded && period && group && (
				<div className="my-grade-layout">
					<ContainerWidget icon={<FiUsers />} label="Groupe">
						<div className="my-grade-row">
							<span>{group.name}</span>
							<span style={{ color: "var(--gray1-col)" }}>{period.name}</span>
						</div>
					</ContainerWidget>

					<ContainerWidget icon={<TbSchool />} label="Note du groupe">
						{groupGrade === null ? (
							<span style={{ color: "var(--gray1-col)" }}>Aucune note disponible pour le moment.</span>
						) : (
							<div className="my-grade-row">
								<div className="my-grade-value">
									{groupGrade.group_grade !== null ? `${groupGrade.group_grade}/20` : "—"}
								</div>
								<Tag
									label={groupGrade.status === "finalized" ? "Finalisée" : groupGrade.status === "submitted" ? "Soumise" : "Brouillon"}
									color={groupGrade.status === "finalized" ? "var(--green-col)" : "var(--orange-col)"}
								/>
							</div>
						)}
						{groupGrade?.group_grade_comment && (
							<p className="my-grade-comment">{groupGrade.group_grade_comment}</p>
						)}
					</ContainerWidget>

					{groupGrade?.individual_grading_enabled && (
						<ContainerWidget icon={<FaRegCheckCircle />} label="Notation individuelle">
							{myGrade?.opted_in ? (
								<>
									<InfoBox
										label={`Vous avez demandé à être noté individuellement${myGrade.opted_in_at ? ` le ${new Date(myGrade.opted_in_at).toLocaleDateString("fr-FR")}` : ""}.`}
										type="success"
									/>
									{myGrade.final_grade !== null && (
										<div className="my-grade-row">
											<span>Note finale individuelle :</span>
											<div className="my-grade-value">{myGrade.final_grade}/20</div>
										</div>
									)}
									{myGrade.individual_grade_comment && (
										<p className="my-grade-comment">{myGrade.individual_grade_comment}</p>
									)}
								</>
							) : (
								<>
									<p style={{ color: "var(--gray1-col)" }}>
										L'encadrant a activé la notation individuelle pour votre groupe. Vous pouvez demander à être noté
										individuellement en plus de la note du groupe.
									</p>
									<Button label="Demander à être noté individuellement" onClick={optInHandle} />
								</>
							)}
						</ContainerWidget>
					)}
				</div>
			)}
		</DashboardPage>
	);
}
