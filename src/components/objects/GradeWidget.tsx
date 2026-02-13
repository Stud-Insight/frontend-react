import React, { useState, useEffect } from "react";
import ContainerWidget from "../ui/ContainerWidget";
import HorizontalDivider from "../ui/HorizontalDivider";
import OverflowMenu from "../input/OverflowMenu";

import { Grade } from "../../services/GradeService";
import { TbSchool } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import Icon from "../../atoms/ui/Icon";
import IconButton from "../button/IconButton";

import "./GradeWidget.css"

interface GradeWidgetProps {
	grade: Grade;
	onEdit?: () => void;
	onDelete?: () => void;
};

export default function GradeWidget({grade, onEdit, onDelete}: GradeWidgetProps){
	const [expanded, setExpanded] = useState<boolean>(false);

	return (
		<ContainerWidget>
			<div className="grade-widget-header">
				<div className="grade-widget-title">
					<Icon icon={<TbSchool/>} color="var(--orange-col)"/>

					<div className="grade-widget-title-right">
						<span style={{fontWeight: "var(--big-bold)"}}>{grade.name}</span>
						<span style={{color: "var(--gray1-col)", fontWeight: "var(--small-bold)"}}>{`coefficient: ${grade.coefficient * 100}%`}</span>
					</div>
				</div>

				<div className="grade-widget-buttons-layout"> 
					{grade.sub_grades && grade.sub_grades.length > 0 &&
						<IconButton size={20} icon={expanded ? <IoIosArrowDown/> : <IoIosArrowUp/>} onClick={() => setExpanded(!expanded)}/>
					}
					<OverflowMenu options={[
						{label: "Modifier", icon: <MdOutlineEdit/>, onClick: () => onEdit?.()},
						{label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => onDelete?.()},
					]}/>
				</div>
			</div>
				
			{grade.sub_grades && grade.sub_grades.length > 0 && expanded && (
				<div className={`grade-widget-content ${expanded ? "expanded" : ""}`}>
					<HorizontalDivider />
					{grade.sub_grades?.map(sub => (
						<div key={sub.id} className="grade-widget-sub-style">
							<span>{sub.name}</span>
							<span>{`${sub.coefficient * 100}%`}</span>
							<span>{sub.max}</span>
						</div>
					))}
				</div>
			)}
			
		</ContainerWidget>
	)
}