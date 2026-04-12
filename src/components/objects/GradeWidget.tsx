import React, { useState } from "react";
import ContainerWidget from "../ui/ContainerWidget";
import HorizontalDivider from "../ui/HorizontalDivider";
import OverflowMenu from "../input/OverflowMenu";

import { Grade } from "../../services/GradeService";
import { TbSchool } from "react-icons/tb";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { RxDragHandleDots2 } from "react-icons/rx";
import { BiUnlink } from "react-icons/bi";
import Icon from "../../atoms/ui/Icon";
import IconButton from "../button/IconButton";

import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import "./GradeWidget.css"

function SubCoefficientBar({subGrades}: {subGrades: Grade[]}) {
	const total = Math.round(subGrades.reduce((sum, g) => sum + g.coefficient, 0) * 100);
	const isValid = total === 100;
	const color = isValid ? "var(--green-col)" : "var(--red-col)";

	return (
		<div style={{
			display: "flex", alignItems: "center", gap: "8px",
			fontSize: "12px", color: "var(--gray1-col)",
		}}>
			<div style={{
				flex: 1, height: "4px", borderRadius: "2px",
				backgroundColor: "var(--gray2-col)", overflow: "hidden",
				maxWidth: "200px",
			}}>
				<div style={{
					width: `${Math.min(total, 100)}%`, height: "100%",
					borderRadius: "2px", backgroundColor: color,
					transition: "width 0.3s",
				}}/>
			</div>
			<span style={{fontWeight: 600, color}}>
				{total}%
			</span>
		</div>
	);
}

function DraggableSubGrade({sub, onEditSub, onDeleteSub, onDetachSub}: {
	sub: Grade;
	onEditSub?: (sub: Grade) => void;
	onDeleteSub?: (sub: Grade) => void;
	onDetachSub?: (sub: Grade) => void;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: sub.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} className="grade-widget-sub-style">
			<div {...attributes} {...listeners} style={{cursor: "grab", display: "flex", alignItems: "center"}}>
				<RxDragHandleDots2 size={14} color="var(--gray1-col)"/>
			</div>
			<span>{sub.name}</span>
			<span>{`${sub.coefficient * 100}%`}</span>
			<span>{sub.max}</span>
			{(onEditSub || onDeleteSub || onDetachSub) &&
				<OverflowMenu options={[
					...(onDetachSub ? [{label: "Détacher", icon: <BiUnlink/>, onClick: () => onDetachSub(sub)}] : []),
					...(onEditSub ? [{label: "Modifier", icon: <MdOutlineEdit/>, onClick: () => onEditSub(sub)}] : []),
					...(onDeleteSub ? [{label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => onDeleteSub(sub)}] : []),
				]}/>
			}
		</div>
	);
}

interface GradeWidgetProps {
	grade: Grade;
	draggable?: boolean;
	isDragOverlay?: boolean;
	onEdit?: () => void;
	onDelete?: () => void;
	onAddSub?: () => void;
	onEditSub?: (sub: Grade) => void;
	onDeleteSub?: (sub: Grade) => void;
	onDetachSub?: (sub: Grade) => void;
};

export default function GradeWidget({grade, draggable, isDragOverlay, onEdit, onDelete, onAddSub, onEditSub, onDeleteSub, onDetachSub}: GradeWidgetProps){
	const hasSubs = grade.sub_grades && grade.sub_grades.length > 0;
	const [expanded, setExpanded] = useState<boolean>(hasSubs === true);

	const {
		attributes,
		listeners,
		setNodeRef: setSortableRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: grade.id, disabled: !draggable });

	const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: grade.id });

	const setNodeRef = (node: HTMLElement | null) => {
		setSortableRef(node);
		setDroppableRef(node);
	};

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : 1,
		outline: isOver && !isDragging ? "2px dashed var(--blue-col)" : undefined,
		borderRadius: isOver && !isDragging ? "12px" : undefined,
	};

	const toggleExpand = () => {
		if (hasSubs) setExpanded(!expanded);
	};

	return (
		<div ref={setNodeRef} style={style}>
			<ContainerWidget>
				<div className="grade-widget-header" onClick={toggleExpand} style={{cursor: hasSubs ? "pointer" : "default"}}>
					<div className="grade-widget-title">
						{draggable && !isDragOverlay && (
							<div {...attributes} {...listeners} onClick={(e) => e.stopPropagation()} style={{cursor: "grab", display: "flex", alignItems: "center"}}>
								<RxDragHandleDots2 size={18} color="var(--gray1-col)"/>
							</div>
						)}
						<Icon icon={<TbSchool/>} color="var(--orange-col)"/>

						<div className="grade-widget-title-right">
							<span style={{fontWeight: "var(--big-bold)"}}>{grade.name}</span>
							<span style={{color: "var(--gray1-col)", fontWeight: "var(--small-bold)"}}>{`coefficient: ${grade.coefficient * 100}%`}</span>
						</div>
					</div>

					<div className="grade-widget-buttons-layout" onClick={(e) => e.stopPropagation()}>
						{hasSubs &&
							<IconButton size={20} icon={expanded ? <IoIosArrowDown/> : <IoIosArrowUp/>} onClick={toggleExpand}/>
						}
						{(onEdit || onDelete || onAddSub) &&
							<OverflowMenu options={[
								...(onAddSub ? [{label: "Ajouter sous-critère", icon: <FaPlus/>, onClick: () => onAddSub()}] : []),
								...(onEdit ? [{label: "Modifier", icon: <MdOutlineEdit/>, onClick: () => onEdit()}] : []),
								...(onDelete ? [{label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => onDelete()}] : []),
							]}/>
						}
					</div>
				</div>

				{hasSubs && expanded && (
					<div className="grade-widget-content expanded">
						<HorizontalDivider />
						<SubCoefficientBar subGrades={grade.sub_grades!}/>
						{grade.sub_grades!.map(sub => (
							<DraggableSubGrade
								key={sub.id}
								sub={sub}
								onEditSub={onEditSub}
								onDeleteSub={onDeleteSub}
								onDetachSub={onDetachSub}
							/>
						))}
					</div>
				)}

			</ContainerWidget>
		</div>
	)
}
