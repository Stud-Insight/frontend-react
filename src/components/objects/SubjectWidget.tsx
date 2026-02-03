import React, { useState } from "react";
import { Subject, SubjectStatus } from "../../services/SubjectService";
import ContainerWidget from "../ui/ContainerWidget";
import HorizontalDivider from "../ui/HorizontalDivider";
import IconButton from "../button/IconButton";
import TagWidget from "../../atoms/ui/Tag";

import { MdDeleteOutline } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { CgExport } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaRegFile, FaRegClock } from "react-icons/fa";
import Icon from "../../atoms/ui/Icon";

import "./SubjectWidget.css"

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
	return (
		<ContainerWidget>
			<div className="subject-widget-layout">
				<div className="subject-widget-expand-button">
					<IconButton icon={expand ? <IoIosArrowUp/> : <IoIosArrowDown/>} onClick={() => setExpand(!expand)}/>
				</div>

				<div className="subject-widget-title-container">
					<Icon icon={<FaRegFile/>} color="var(--blue-col)"/>
					
					<div className="subject-widget-title-right">
						<label style={{fontWeight: "var(--big-bold)", fontSize: 20}}>{subject.title}</label>
						{subject.author && subject.author.map((user, index) => (
							<label key={index} style={{fontSize: 14, color: "var(--gray1-col)"}}>{user.first_name} {user.last_name.toUpperCase()}</label>
						))}
					</div>
				</div>
				
				<div className={`subject-widget-expandable ${expand ? " expanded" : ""}`}>
					<label style={{fontSize: 14, color: "var(--gray1-col)"}}>{subject.description}</label>

					<div className="subject-widget-task-list">
						{subject.tasks && subject.tasks.map((task, index) => (
							<div key={index} style={{fontSize: 14, color: "var(--gray1-col)"}}> - {task}</div>
						))}
					</div>		
				</div>
				
				<div className="subject-widget-tag-layout">
					{subject.min_person && subject.max_person ? 
						<TagWidget label={`${subject.min_person} - ${subject.max_person} Etudiants`} color="var(--blue-col)"/>
					:
						<TagWidget label={`${subject.max_person} Etudiants`} color="var(--blue-col)"/>
					}
					
					{subject.language?.map((lang, index) => (
						<TagWidget key={index} label={lang} color="var(--blue-col)"/>
					))}
				</div>
				
				{privateMode &&
					<>
						<HorizontalDivider/>

						<div className="subject-widget-footer-layout">
							<div className="subject-widget-footer-content">
								<TagWidget label={SubjectStatus.DRAFT} color="var(--blue-col)"/>
								-
								<label style={{fontSize: "14px"}}>{subject.created_date}</label>
							</div>

							<div className="subject-widget-footer-content">
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