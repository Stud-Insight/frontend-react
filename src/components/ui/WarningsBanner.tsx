import React, { useState } from "react";
import { MdError, MdWarning, MdExpandMore, MdExpandLess } from "react-icons/md";
import { WorkflowWarning } from "../../services/TERService";
import "./WarningsBanner.css";

interface WarningsBannerProps {
	warnings: WorkflowWarning[];
}

export default function WarningsBanner({ warnings }: WarningsBannerProps) {
	const [expanded, setExpanded] = useState(false);

	const errors = warnings.filter(w => w.level === "error");
	const warns = warnings.filter(w => w.level === "warning");
	const total = warnings.length;

	if (total === 0) return null;

	return (
		<div className="warnings-banner">
			<div className="warnings-banner-header" onClick={() => setExpanded(!expanded)}>
				<div className="warnings-banner-summary">
					{errors.length > 0 && (
						<span className="warnings-badge error">
							<MdError size={16}/> {errors.length} erreur{errors.length > 1 ? "s" : ""}
						</span>
					)}
					{warns.length > 0 && (
						<span className="warnings-badge warning">
							<MdWarning size={16}/> {warns.length} avertissement{warns.length > 1 ? "s" : ""}
						</span>
					)}
				</div>
				{expanded ? <MdExpandLess size={22}/> : <MdExpandMore size={22}/>}
			</div>

			{expanded && (
				<div className="warnings-banner-list">
					{errors.map((w, i) => (
						<div key={`err-${i}`} className="warnings-banner-item error">
							<MdError size={16}/>
							<span>{w.message}</span>
						</div>
					))}
					{warns.map((w, i) => (
						<div key={`warn-${i}`} className="warnings-banner-item warning">
							<MdWarning size={16}/>
							<span>{w.message}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
