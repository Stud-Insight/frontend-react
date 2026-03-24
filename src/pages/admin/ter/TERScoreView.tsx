import React, { useState, useEffect } from "react";
import GradeService, { GroupGradeSummary, ScoredGrade } from "../../../services/GradeService";
import { Group } from "../../../services/GroupService";
import ContainerWidget from "../../../components/ui/ContainerWidget";
import Button from "../../../atoms/input/Button";
import InfoBox from "../../../components/ui/InfoBox";

import { TbSchool } from "react-icons/tb";
import { FiSave, FiChevronDown, FiChevronRight } from "react-icons/fi";
import Icon from "../../../atoms/ui/Icon";

import "./TERGroupView.css";

interface ScoreInputProps {
	criterion: ScoredGrade;
	value: number | null;
	onChange: (criterionId: string, score: number | null) => void;
}

function ScoreInput({criterion, value, onChange}: ScoreInputProps) {
	const max = criterion.max || 20;
	const [localValue, setLocalValue] = useState<string>(value != null ? String(value) : "");

	useEffect(() => {
		setLocalValue(value != null ? String(value) : "");
	}, [value]);

	const handleBlur = () => {
		if (localValue.trim() === "") {
			onChange(criterion.id, null);
			return;
		}
		const raw = parseFloat(localValue);
		if (isNaN(raw)) return;
		const clamped = Math.min(Math.max(raw, 0), max);
		setLocalValue(String(clamped));
		onChange(criterion.id, clamped);
	};

	return (
		<div style={{
			display: "grid", gridTemplateColumns: "1fr 120px",
			alignItems: "center", gap: "10px", padding: "6px 0",
		}}>
			<span style={{fontSize: "14px"}}>{criterion.name} ({criterion.coefficient * 100}%)</span>
			<div style={{display: "flex", alignItems: "center", gap: "4px"}}>
				<input
					type="number"
					min={0}
					max={max}
					step={0.5}
					value={localValue}
					onChange={(e) => setLocalValue(e.target.value)}
					onBlur={handleBlur}
					style={{
						width: "60px", padding: "4px 8px", borderRadius: "6px",
						border: "1px solid var(--gray2-col)", fontSize: "14px",
						textAlign: "center",
					}}
				/>
				<span style={{fontSize: "12px", color: "var(--gray1-col)"}}>/{max}</span>
			</div>
		</div>
	);
}

interface CriterionBlockProps {
	criterion: ScoredGrade;
	scores: Map<string, number>;
	onChange: (criterionId: string, score: number | null) => void;
}

function CriterionBlock({criterion, scores, onChange}: CriterionBlockProps) {
	const [expanded, setExpanded] = useState(true);
	const hasSubs = criterion.sub_grades && criterion.sub_grades.length > 0;

	return (
		<ContainerWidget>
			<div style={{
				display: "flex", alignItems: "center", justifyContent: "space-between",
				cursor: hasSubs ? "pointer" : "default",
			}} onClick={() => hasSubs && setExpanded(!expanded)}>
				<div style={{display: "flex", alignItems: "center", gap: "10px"}}>
					<Icon icon={<TbSchool/>} color="var(--orange-col)"/>
					<div>
						<span style={{fontWeight: 600}}>{criterion.name}</span>
						<span style={{color: "var(--gray1-col)", fontSize: "12px", marginLeft: "8px"}}>
							({criterion.coefficient * 100}%)
						</span>
					</div>
				</div>
				{hasSubs && (expanded ? <FiChevronDown size={18}/> : <FiChevronRight size={18}/>)}
			</div>

			{hasSubs && expanded && (
				<div style={{paddingLeft: "20px", marginTop: "8px"}}>
					{criterion.sub_grades!.map(sub => (
						<ScoreInput
							key={sub.id}
							criterion={sub}
							value={scores.get(sub.id) ?? null}
							onChange={onChange}
						/>
					))}
				</div>
			)}

			{!hasSubs && (
				<div style={{marginTop: "8px"}}>
					<ScoreInput criterion={criterion} value={scores.get(criterion.id) ?? null} onChange={onChange}/>
				</div>
			)}
		</ContainerWidget>
	);
}

interface TERScoreViewProps {
	periodId: string;
	groups: Group[];
	readOnly?: boolean;
	onSuccess: (msg: string) => void;
	onError: (msg: string) => void;
}

export default function TERScoreView({periodId, groups, readOnly, onSuccess, onError}: TERScoreViewProps) {
	const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
	const [summary, setSummary] = useState<GroupGradeSummary | null>(null);
	const [scores, setScores] = useState<Map<string, number>>(new Map());
	const [loading, setLoading] = useState(false);

	const loadGroupScores = async (group: Group) => {
		setSelectedGroup(group);
		setLoading(true);
		try {
			const data = await GradeService.getGroupScores(periodId, group.id);
			setSummary(data);
			// Initialize scores map from existing data
			const map = new Map<string, number>();
			const fillScores = (criteria: ScoredGrade[]) => {
				for (const c of criteria) {
					if (c.score != null) map.set(c.id, c.score);
					if (c.sub_grades) fillScores(c.sub_grades);
				}
			};
			fillScores(data.criteria);
			setScores(map);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			onError(message);
		}
		setLoading(false);
	};

	const handleScoreChange = (criterionId: string, score: number | null) => {
		setScores(prev => {
			const next = new Map(prev);
			if (score === null) {
				next.delete(criterionId);
			} else {
				next.set(criterionId, score);
			}
			return next;
		});
	};

	const saveScores = async () => {
		if (!selectedGroup) return;
		try {
			const payload = Array.from(scores.entries()).map(([criterion_id, score]) => ({
				criterion_id,
				score,
			}));
			const data = await GradeService.saveGroupScores(periodId, selectedGroup.id, payload);
			setSummary(data);
			onSuccess(`Notes sauvegardées pour "${selectedGroup.name}". Total: ${data.total_grade != null ? data.total_grade + "/20" : "incomplet"}`);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			onError(message);
		}
	};

	return (
		<>
			<div style={{display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px"}}>
				{groups.map(g => (
					<Button
						key={g.id}
						label={g.name}
						onClick={() => loadGroupScores(g)}
						color={selectedGroup?.id === g.id ? "var(--blue-col)" : undefined}
					/>
				))}
			</div>

			{!selectedGroup && (
				<InfoBox label="Sélectionnez un groupe pour saisir les notes." type="info"/>
			)}

			{loading && <InfoBox label="Chargement..." type="info"/>}

			{selectedGroup && summary && !loading && (
				<>
					<div style={{
						display: "flex", justifyContent: "space-between", alignItems: "center",
						padding: "10px 15px", borderRadius: "10px",
						backgroundColor: "var(--beige-col)", marginBottom: "10px",
					}}>
						<div>
							<span style={{fontWeight: 700, fontSize: "18px"}}>{selectedGroup.name}</span>
							{summary.total_grade != null && (
								<span style={{marginLeft: "15px", fontSize: "16px", fontWeight: 600, color: "var(--blue-col)"}}>
									Note: {summary.total_grade}/{summary.max_grade}
								</span>
							)}
						</div>
						{!readOnly && (
							<Button icon={<FiSave/>} label="Sauvegarder" onClick={saveScores}/>
						)}
					</div>

					{summary.criteria.map(criterion => (
						<CriterionBlock
							key={criterion.id}
							criterion={criterion}
							scores={scores}
							onChange={readOnly ? () => {} : handleScoreChange}
						/>
					))}
				</>
			)}
		</>
	);
}
