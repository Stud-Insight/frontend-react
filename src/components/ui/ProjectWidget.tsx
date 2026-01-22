import React from "react";
import { Sujet } from "../../services/ProjectService";
import { User } from "../../services/UserService";
import VerticalDivider from "./VerticalDivider";
import { FaUser } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { MdDownload } from "react-icons/md";
import IconButton from "../input/IconButton";

import "./ProjectWidget.css"

interface ProjectWidgetProps {
	project: Sujet;
	show_more?: boolean;
	onDownload?: () => void;
	onDelete?: () => void;
	onEdit?: () => void;
};

export default function ProjectWidget({ show_more = true, project, onDelete, onEdit, onDownload }: ProjectWidgetProps){
	const min = project.min_person;
	const max = project.max_person;

	return (
		<div className="project-widget-layout">
			<label className="project-widget-title-style">{project.title}</label>
			{project.author.map((author: User, index) => (
				<label className="project-widget-description-style"> Encadrant: {author.first_name} {author.last_name.toUpperCase()}</label>
			))}

			<label className="project-widget-description-style">{project.description}</label>
			
			<div className="project-widget-edit">
				<IconButton icon={<MdDownload/>} onClick={onDownload}/>
				<IconButton icon={<MdModeEdit/>} onClick={onEdit}/>
				<IconButton icon={<RxCross2/>} onClick={onDelete}/>
			</div>

			{show_more && 
				<>	
					<div className="project-widget-tache-layout">
						{project.tasks?.map((tache, index) => (
							<div key={index} className="project-widget-description-style"> - {tache}</div>
						))}
					</div>
					
					<div className="project-widget-tag-layout">
						{(min != null || max != null) && (
							<div className="project-widget-tag-style">
								<FaUser />
								{min != null && max != null ? (
									<>
										<label>{min}</label>
										<label>-</label>
										<label>{max}</label>
									</>
								) : (
									<label>{Math.max(min ?? 0, max ?? 0)}</label>
								)}
							</div>
						)}

						{project.language?.map((lang, index) => (
							<div key={index} className="project-widget-tag-style">{lang}</div>
						))}
					</div>	
				</>
			}
			
		</div>	
	);
}