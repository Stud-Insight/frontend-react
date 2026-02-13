import React, { useState, useEffect } from "react";
import ContainerWidget from "../ui/ContainerWidget";
import { Group } from "../../services/GroupService";
import { FiUsers } from "react-icons/fi";
import Button from "../../atoms/input/Button";
import Icon from "../../atoms/ui/Icon";

import "./GroupProjectWidget.css"

interface GroupProjectWidgetProps {
	group: Group;
};

export default function GroupProjectWidget({group}: GroupProjectWidgetProps){
	return (
		<ContainerWidget>
			<div className="group-project-widget-layout">
				<div className="group-project-widget-title">
					<Icon icon={<FiUsers/>} color="var(--blue-col)"/>
					<div className="group-project-widget-title-right">
						<span style={{fontWeight: "var(--big-bold)"}}>{group.name}</span>
						<span style={{color: "var(--gray1-col)", fontWeight: "var(--small-bold)"}}>{group.id}</span>
					</div>
				</div>	

				{/* <div className="group-project-name-tags-layout">
					{group.members.map((stud, index) => (
						<span className="group-project-name-tags">{stud.first_name} {stud.last_name}</span>
					))}
				</div>
				
				{group.members.length > 0 ?
					<Button label={"Demande Rejoindre"}/>
				:
					<Button label={"Rejoindre"}/>
				} */}
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