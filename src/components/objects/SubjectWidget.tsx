import React, { useState, useEffect } from "react";
import { Subject, SubjectStatus, SubjectStatusLabel, SubjectStatusColor } from "../../services/SubjectService";
import ContainerWidget from "../ui/ContainerWidget";
import HorizontalDivider from "../ui/HorizontalDivider";
import IconButton from "../button/IconButton";
import Tag from "../../atoms/ui/Tag";
import Icon from "../../atoms/ui/Icon";
import OverflowMenu from "../../components/input/OverflowMenu";
import { MdDeleteOutline } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { CgExport } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaRegFile} from "react-icons/fa";
import "./SubjectWidget.css";
import Button from "../../atoms/input/Button";

interface SubjectWidgetProps {
	subject: Subject;
	privateMode?: boolean;
	adminMode?: boolean;
	onDownload?: () => void;
	onDelete?: () => void;
	onEdit?: () => void;
	onPublish?: () => void;
	onExport?: () => void;
	onAccept?: () => void;
	onReject?: () => void;
};

export default function SubjectWidget({subject, privateMode = true, adminMode = false, onDelete, onEdit, onDownload, onPublish, onExport, onAccept, onReject}: SubjectWidgetProps){
	const [expand, setExpand] = useState<boolean>(false);

	let options = [
		{label: "Télécharger", icon: <CgExport/>, onClick: () => {onExport?.()}}
	];	

	if (subject.status == SubjectStatus.DRAFT){
		options.push({label: "Publier", icon: <LuSend/>, onClick: () => {onPublish?.()}});
		options.push({label: "Modifier", icon: <MdOutlineEdit/>, onClick: () => {onEdit?.()}});
		options.push({label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => {onDelete?.()}});
	}
	
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
				<div className="subject-widget-header">
					<div className="subject-widget-title-container">
						<Icon icon={<FaRegFile/>} color="var(--blue-col)"/>
						
						<div className="subject-widget-title-right">
							<div className="group-content-title">
								<span style={{fontWeight: "var(--big-bold)", fontSize: 20}}>{subject.title}</span>
								
								{privateMode &&
									<Tag label={SubjectStatusLabel.get(subject.status)} color={SubjectStatusColor.get(subject.status)}/>								
								}
							</div>

							{privateMode &&
								<span style={{fontSize: 14, color: "var(--gray1-col)"}}>{dateFormat(subject.created)}</span>
							}
							
							<span style={{fontSize: 14, color: "var(--gray1-col)"}}>{subject.professor?.first_name} {subject.professor?.last_name.toUpperCase()}</span>
						</div>
					</div>
					<div className="subject-widget-expand-button">
						{adminMode && subject.status == SubjectStatus.SUBMITTED &&
							<>
								<Button label="Rejeter" onClick={onReject}/>
								<Button label="Accepter" onClick={onAccept}/>
							</>
						}

						<IconButton icon={expand ? <IoIosArrowUp/> : <IoIosArrowDown/>} onClick={() => setExpand(!expand)}/>
						{privateMode &&
							<OverflowMenu options={options}/>
						}
					</div>
				</div>
				
				{expand &&
					<>
						<HorizontalDivider/>

						<div className={`subject-widget-expandable ${expand ? " expanded" : ""}`}>
							<span style={{fontSize: 14, color: "var(--gray1-col)"}}>{subject.description}</span>

							<div className="subject-widget-task-list">
								{subject.taches && subject.taches.map((task, index) => (
									<div key={index} style={{fontSize: 14, color: "var(--gray1-col)"}}> - {task}</div>
								))}
							</div>

							<div className="subject-widget-tag-layout"> 
								{subject.min_group_size == subject.max_group_size ? 
									<Tag label={`${subject.max_group_size} Etudiants`}/>
									:
									<Tag label={`${subject.min_group_size} - ${subject.max_group_size} Etudiants`}/>
								}
								{subject.tags?.map((tag, index) => (
									<Tag key={index} label={tag}/>
								))}
							</div>
						</div>
					</>
				}
			</div>
		</ContainerWidget>
	);
}