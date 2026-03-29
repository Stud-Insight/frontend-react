import React from "react";
import { SubjectRank } from "../../services/SubjectService";
import ContainerWidget from "../ui/ContainerWidget";
import { FaRegFile } from "react-icons/fa";
import Icon from "../../atoms/ui/Icon";

import "./SubjectRankWidget.css"

interface SubjectRankWidgetProps {
	data: SubjectRank;
};

export default function SubjectRankWidget({ data }: SubjectRankWidgetProps) {
	return (
		<ContainerWidget>
			<div className="subject-rank-widget-layout">
				<div className="subject-rank-widget-title">
					<Icon icon={<FaRegFile />} color="var(--blue-col)" />
					<span className="subject-rank-widget-subject">{data.subject_title}</span>
				</div>

				<div className="subject-rank-widget-rank">
					<span className="subject-rank-widget-rank-label">Rang</span>
					<span className="subject-rank-widget-rank-value">{data.rank}</span>
				</div>
			</div>
		</ContainerWidget>
	)
}