import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardPage from "../DashboardPage";
import DeliverableService, { Deliverable, DeliverableType, DeliverableTypeLabel } from "../../../services/DeliverableService";
import GradeService, { PeerReviewAggregate } from "../../../services/GradeService";
import FileService from "../../../services/FileService";
import ContainerWidget from "../../../components/ui/ContainerWidget";
import InfoBox from "../../../components/ui/InfoBox";
import IconButton from "../../../components/button/IconButton";
import Button from "../../../atoms/input/Button";

import { FaRegFile } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { MdArrowBack } from "react-icons/md";
import { TbSchool } from "react-icons/tb";

import "./TERExecutionView.css";
import "./MyGradePage.css";

export default function GroupDeliverablesPage() {
	const { group_id } = useParams<{ group_id: string }>();
	const navigate = useNavigate();
	const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
	const [peerReviews, setPeerReviews] = useState<PeerReviewAggregate[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loaded, setLoaded] = useState<boolean>(false);

	useEffect(() => {
		const fetch = async () => {
			if (!group_id) return;
			try {
				const [deliv, reviews] = await Promise.all([
					DeliverableService.listGroupDeliverables(group_id),
					GradeService.getAggregatedPeerReviews(group_id).catch(() => [] as PeerReviewAggregate[]),
				]);
				setDeliverables(deliv);
				setPeerReviews(reviews);
			} catch (err) {
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			} finally {
				setLoaded(true);
			}
		};
		fetch();
	}, [group_id]);

	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<Button icon={<MdArrowBack />} label="Retour" onClick={() => navigate(-1)} />
					<span style={{ fontWeight: "var(--big-bold)", fontSize: "25px" }}>Livrables du groupe</span>
				</div>
			</div>

			{error && <InfoBox label={error} type="error" />}

			<div className="ter-execution-layout">
				<ContainerWidget icon={<FaRegFile />} label={`Livrables (${deliverables.length})`}>
					{!loaded ? (
						<span style={{ color: "var(--gray1-col)" }}>Chargement...</span>
					) : deliverables.length === 0 ? (
						<span style={{ color: "var(--gray1-col)" }}>Aucun livrable déposé pour le moment.</span>
					) : (
						<div className="ter-execution-deliverable-list">
							{deliverables.map((d) => (
								<div key={d.id} className="ter-execution-deliverable-item">
									<FaRegFile />
									<div className="ter-execution-deliverable-info">
										<span className="ter-execution-deliverable-name">{d.original_filename}</span>
										<span className="ter-execution-deliverable-meta">
											{DeliverableTypeLabel[d.deliverable_type as DeliverableType] ?? d.deliverable_type}
											{" · "}
											{FileService.formatFileSize(d.size)}
											{" · "}
											{FileService.formatFileDate(d.created)}
										</span>
									</div>
									<IconButton icon={<LuDownload />} onClick={() => DeliverableService.downloadDeliverable(d.id)} />
								</div>
							))}
						</div>
					)}
				</ContainerWidget>

				<ContainerWidget icon={<TbSchool />} label={`Peer reviews agrégés (${peerReviews.length})`}>
					{!loaded ? (
						<span style={{ color: "var(--gray1-col)" }}>Chargement...</span>
					) : peerReviews.length === 0 ? (
						<span style={{ color: "var(--gray1-col)" }}>Aucun peer review soumis pour le moment.</span>
					) : (
						<div className="ter-execution-deliverable-list">
							{peerReviews.map((r) => (
								<div key={r.student_id} className="ter-execution-deliverable-item">
									<TbSchool />
									<div className="ter-execution-deliverable-info">
										<span className="ter-execution-deliverable-name">{r.student_name}</span>
										<span className="ter-execution-deliverable-meta">
											{r.review_count} avis · Contribution {r.avg_contribution.toFixed(1)}/5 ·
											Collaboration {r.avg_collaboration.toFixed(1)}/5 ·
											Technique {r.avg_technical_skill.toFixed(1)}/5
										</span>
										{r.comments.length > 0 && (
											<p className="my-grade-comment" style={{ margin: 0, padding: "5px 0 0" }}>
												{r.comments.map((c, i) => `« ${c} »`).join(" · ")}
											</p>
										)}
									</div>
									<div className="my-grade-value" style={{ fontSize: "20px" }}>
										{r.overall_average.toFixed(1)}/5
									</div>
								</div>
							))}
						</div>
					)}
				</ContainerWidget>
			</div>
		</DashboardPage>
	);
}
