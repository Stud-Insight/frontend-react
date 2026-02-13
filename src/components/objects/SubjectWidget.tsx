import React, { useState } from "react";
import { Subject, SubjectStatus, SubjectStatusLabel, SubjectStatusColor } from "../../services/SubjectService";
import ContainerWidget from "../ui/ContainerWidget";
import HorizontalDivider from "../ui/HorizontalDivider";
import IconButton from "../button/IconButton";
import TagWidget from "../../atoms/ui/Tag";
import Icon from "../../atoms/ui/Icon";
import OverflowMenu from "../../components/input/OverflowMenu";

import { MdDeleteOutline } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { CgExport } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaRegFile, FaRegClock } from "react-icons/fa";

import "./SubjectWidget.css";

interface SubjectWidgetProps {
	subject: Subject;
	privateMode?: boolean;
	onDownload?: () => void;
	onDelete?: () => void;
	onEdit?: () => void;
	onPublish?: () => void;
	onExport?: () => void;
};

export default function SubjectWidget({subject, privateMode = true, onDelete, onEdit, onDownload, onPublish, onExport}: SubjectWidgetProps){
	const [expand, setExpand] = useState<boolean>(false);

	const dateFormat = (dateString: string) => {
		const date_t = new Date(dateString);

        return date_t.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
        });
	}

	return (
		<ContainerWidget>
			<div className="subject-widget-layout">
				{subject.description &&
					<div className="subject-widget-expand-button">
						<IconButton icon={expand ? <IoIosArrowUp/> : <IoIosArrowDown/>} onClick={() => setExpand(!expand)}/>
					</div>
				}
				
				<div className="subject-widget-title-container">
					<Icon icon={<FaRegFile/>} color="var(--blue-col)"/>
					
					<div className="subject-widget-title-right">
						<span style={{fontWeight: "var(--big-bold)", fontSize: 20}}>{subject.title}</span>
						<span style={{fontSize: 14, color: "var(--gray1-col)"}}>{subject.professor?.first_name} {subject.professor?.last_name.toUpperCase()}</span>
					</div>
				</div>

				<div className={`subject-widget-expandable ${expand ? " expanded" : ""}`}>
					<span style={{fontSize: 14, color: "var(--gray1-col)"}}>{subject.description}</span>

					<div className="subject-widget-task-list">
						{subject.taches && subject.taches.map((task, index) => (
							<div key={index} style={{fontSize: 14, color: "var(--gray1-col)"}}> - {task}</div>
						))}
					</div>

					<div className="subject-widget-tag-layout"> 
						{subject.min_group_size == subject.max_group_size ? 
							<TagWidget label={`${subject.max_group_size} Etudiants`}/>
							:
							<TagWidget label={`${subject.min_group_size} - ${subject.max_group_size} Etudiants`}/>
						}
						{subject.tags?.map((tag, index) => (
							<TagWidget key={index} label={tag}/>
						))}
					</div>
				</div>
				
				{privateMode &&
					<>
						<HorizontalDivider/>

						<div className="subject-widget-footer-layout">
							<div className="subject-widget-footer-content">
								<TagWidget label={SubjectStatusLabel.get(subject.status)} color={SubjectStatusColor.get(subject.status)}/>
								-
								<span style={{fontSize: "14px"}}>{dateFormat(subject.created)}</span>
							</div>

							<OverflowMenu options={[
								{label: "Télécharger", icon: <CgExport/>, onClick: () => {onExport?.()}},
								{label: "Publier", icon: <LuSend/>, onClick: () => {onPublish?.()}},
								{label: "Modifier", icon: <MdOutlineEdit/>, onClick: () => {onEdit?.()}},
								{label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => {onDelete?.()}},
							]}/>
						</div>
					</>
				}
				
			</div>
		</ContainerWidget>
	);
}