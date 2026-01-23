import React from "react";
import { Project } from "../../services/ProjectService";
import ContainerWidget from "../ui/ContainerWidget";
import HorizontalDivider from "../ui/HorizontalDivider";
import IconButton from "../input/IconButton";

import { MdDeleteOutline } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { CgExport } from "react-icons/cg";

import "./ProjectWidget.css"

interface ProjectWidgetProps {
	project: Project;
	onDownload?: () => void;
	onDelete?: () => void;
	onEdit?: () => void;
	onPublish?: () => void;
	onExport?: () => void;
};

export default function ProjectWidget({project, onDelete, onEdit, onDownload, onPublish, onExport }: ProjectWidgetProps){
	return (
		<ContainerWidget>
			<div className="project-widget-layout">
				<label style={{fontWeight: "var(--big-bold)", fontSize: 20}}>{project.title}</label>
				<label style={{fontSize: 14}}>{project.description}</label>

				<div className="project-widget-tag-layout">
					{project.min_person && project.max_person ? 
						<div className="project-widget-tag-style">{project.min_person} - {project.max_person} Etudiants</div>
					:
						<div className="project-widget-tag-style">{Math.max(project.min_person, project.max_person)} Etudiants</div>
					}
					
					{project.language?.map((lang, index) => (
						<div className="project-widget-tag-style">{lang}</div>
					))}
				</div>

				<HorizontalDivider/>

				<div className="project-widget-footer-layout">
					<IconButton icon={<CgExport/>} onClick={onExport}/>
					<IconButton icon={<MdOutlineEdit/>} onClick={onEdit}/>
					<IconButton icon={<LuSend/>} onClick={onPublish}/>
					<IconButton icon={<MdDeleteOutline/>} onClick={onDelete}/>
				</div>
			</div>
		</ContainerWidget>
	);
}