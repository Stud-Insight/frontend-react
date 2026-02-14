import React, { useState, useEffect } from "react";
import ContainerWidget from "../ui/ContainerWidget";
import { Group } from "../../services/GroupService";
import { FiUsers } from "react-icons/fi";
import Button from "../../atoms/input/Button";
import Icon from "../../atoms/ui/Icon";
import OverflowMenu from "../input/OverflowMenu";
import IconButton from "../button/IconButton";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import UserWidget from "./UserWidget";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FiUser } from "react-icons/fi";

import "./GroupProjectWidget.css"

interface GroupProjectWidgetProps {
	group: Group;
	onEdit?: () => void;
	onDelete?: () => void;
};

export default function GroupProjectWidget({group, onEdit, onDelete}: GroupProjectWidgetProps){
	const [expanded, setExpanded] = useState<boolean>(false);

	return (
		<ContainerWidget>
			<div className="group-project-widget-header">
				<div className="group-project-widget-title">
					<Icon icon={<FiUsers/>} color="var(--blue-col)"/>
					<div className="group-project-widget-title-right">
						<span style={{fontWeight: "var(--big-bold)"}}>{group.name}</span>
						<span style={{color: "var(--gray1-col)", fontWeight: "var(--small-bold)"}}>{group.id}</span>
						<span className="group-project-info">{group.members ? group.members.length : 0} / {group.max_group_size}</span>
					</div>
				</div>

				<div className="group-widget-buttons-layout">
					<IconButton size={20} icon={expanded ? <IoIosArrowUp/> : <IoIosArrowDown/>} onClick={() => setExpanded(!expanded)}/>
					<OverflowMenu options={[
						{label: "Modifier", icon: <MdOutlineEdit/>, onClick: () => onEdit?.()},
						{label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => onDelete?.()},
					]}/>
				</div>	
			</div>

			{expanded && 
				<div className={`group-content ${expanded ? "expanded" : ""}`}>
					<UserWidget user={group.leader} selected={false} isLeader={true}/>
					{group.members && group.members.map(member => {
						if (member.id != group.leader.id){
							return <UserWidget key={member.id} user={member} selected={false} isLeader={false}/>
						}
					})}
				</div>
			}
		</ContainerWidget>
	)
}