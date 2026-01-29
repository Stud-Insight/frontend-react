import React, { useState } from "react";
import { Project, ProjectStatus } from "../../services/ProjectService";
import ContainerWidget from "../ui/ContainerWidget";
import HorizontalDivider from "../ui/HorizontalDivider";
import IconButton from "../input/IconButton";
import TagWidget from "../ui/TagWidget";

import { MdDeleteOutline } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { CgExport } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaRegFile, FaRegClock } from "react-icons/fa";

import "./ProjectWidget.css"

interface ProjectWidgetProps {
	project: Project;
	privateMode?: boolean;
	onDownload?: () => void;
	onDelete?: () => void;
	onEdit?: () => void;
	onPublish?: () => void;
	onExport?: () => void;
};

export default function ProjectWidget({project, privateMode = true, onDelete, onEdit, onDownload, onPublish, onExport}: ProjectWidgetProps){
	const [expand, setExpand] = useState<boolean>(false);

	const status_tag_map = new Map<ProjectStatus, string>([
		[ProjectStatus.APPROVED, "Approuvé"],
		[ProjectStatus.SUBMITTED, "Soumis"],
		[ProjectStatus.REJECTED, "Rejeté"],
		[ProjectStatus.DRAFT, "Brouillon"],
	]);

	// const get_status_class = ():string => {
	// 	var state_class: string = "project-widget-state-style";

	// 	switch (project.status){
	// 		case ProjectStatus.APPROVED: state_class += " approved"; break;
	// 		case ProjectStatus.SUBMITTED: state_class += " submitted"; break;
	// 		case ProjectStatus.REJECTED: state_class += " rejected"; break;
	// 		default: state_class += " draft"; break;
	// 	}
		
	// 	return state_class;
	// };

	return (
		<ContainerWidget>
			<div className="project-widget-layout">
				<div className="project-widget-expand-button">
					<IconButton icon={expand ? <IoIosArrowUp/> : <IoIosArrowDown/>} onClick={() => setExpand(!expand)}/>
				</div>

				<div className="projet-widget-title-container">
					<div className="info-widget-icon">
						<FaRegFile/>
					</div>
					<div className="project-widget-title-right">
						<label style={{fontWeight: "var(--big-bold)", fontSize: 20}}>{project.title}</label>
						{project.author && project.author.map((user, index) => (
							<label key={index} style={{fontSize: 14, color: "var(--gray1-col)"}}>{user.first_name} {user.last_name.toUpperCase()}</label>
						))}
					</div>
				</div>
				
				<div className={`project-widget-expandable ${expand ? " expanded" : ""}`}>
					<label style={{fontSize: 14, color: "var(--gray1-col)"}}>{project.description}</label>

					<div className="project-widget-task-list">
						{project.tasks && project.tasks.map((task, index) => (
							<div key={index} style={{fontSize: 14, color: "var(--gray1-col)"}}> - {task}</div>
						))}
					</div>		
				</div>
				
				<div className="project-widget-tag-layout">
					{project.min_person && project.max_person ? 
						<TagWidget label={`${project.min_person} - ${project.max_person} Etudiants`} color="var(--blue-col)"/>
					:
						<TagWidget label={`${project.max_person} Etudiants`} color="var(--blue-col)"/>
					}
					
					{project.language?.map((lang, index) => (
						<TagWidget label={lang} color="var(--blue-col)"/>
					))}
				</div>
				
				{privateMode &&
					<>
						<HorizontalDivider/>

						<div className="project-widget-footer-layout">
							<div className="project-widget-footer-content">
								<TagWidget label={status_tag_map.get(project.status)} color="var(--blue-col)"/>
								-
								<label style={{fontSize: "14px"}}>{project.created_date}</label>
							</div>

							<div className="project-widget-footer-content">
								<IconButton icon={<CgExport/>} onClick={onExport}/>
								<IconButton icon={<MdOutlineEdit/>} onClick={onEdit}/>
								<IconButton icon={<LuSend/>} onClick={onPublish}/>
								<IconButton icon={<MdDeleteOutline/>} onClick={onDelete}/>
							</div>
						</div>
					</>
				}
				
			</div>
		</ContainerWidget>
	);
}