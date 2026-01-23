import React, {useState, useEffect} from "react";
import ContainerWidget from "../ui/ContainerWidget";
import { GroupProject } from "../../services/TERService";
import { FiUsers } from "react-icons/fi";
import IconButton from "../input/IconButton";
import HorizontalDivider from "../ui/HorizontalDivider";
import "./GroupProjectWidget.css"

import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import ProgressWidget from "../ui/ProgressWidget";

interface GroupProjectWidgetProps {
	group: GroupProject;
};

export default function GroupProjectWidget({group}: GroupProjectWidgetProps){
	let completed_objectives: number = 0;

	group.objectives.forEach((obj, index) => {
		if (obj.done) {
			completed_objectives += 1;
		}
	});

	return (
		<ContainerWidget>
			<div className="group-project-widget-layout">
				<div className="group-project-widget-title">
					<div className="info-widget-icon">
						<FiUsers/>
					</div>
					<div className="group-project-widget-title-right">
						<label style={{fontWeight: "var(--big-bold)"}}>{group.titre}</label>
						<label style={{color: "var(--gray1-col)", fontWeight: "var(--small-bold)"}}>{group.id}</label>
					</div>
				</div>	

				<div className="group-project-name-tags-layout">
					{group.group.students.map((stud, index) => (
						<label className="group-project-name-tags">{stud.first_name} {stud.last_name}</label>
					))}
				</div>
				
				<label style={{fontWeight: "var(--small-bold)", color: "var(--gray1-col)"}}>Projet</label>
				<label style={{fontWeight: "var(--big-bold)"}}>{group.project?.title}</label>
			</div>
			
			

			{/* <div className="group-project-footer">
				<ProgressWidget progress={0.5}/>
				<div className="group-project-footer-buttons">
					<IconButton icon={<MdOutlineEdit/>}/>
					<IconButton icon={<MdDeleteOutline/>}/>
				</div>
			</div> */}
		</ContainerWidget>
	)
}