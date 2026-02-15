import React, { useState } from "react";
import ContainerWidget from "../ui/ContainerWidget";
import { Group, GroupStatusLabel, GroupStatusColor, GroupStatus } from "../../services/GroupService";
import { FiUsers } from "react-icons/fi";
import { User } from "../../services/UserService";
import Icon from "../../atoms/ui/Icon";
import OverflowMenu from "../input/OverflowMenu";
import IconButton from "../button/IconButton";
import UserWidget from "./UserWidget";
import Tag from "../../atoms/ui/Tag";

import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaCrown } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

import "./GroupProjectWidget.css"

interface GroupProjectWidgetProps {
	group: Group;
	onEdit?: () => void;
	onDelete?: () => void;
	onLeader?: (user: User) => void;
	onUserDelete?: (user: User) => void;
};

export default function GroupProjectWidget({group, onEdit, onDelete, onLeader, onUserDelete}: GroupProjectWidgetProps){
	const [expanded, setExpanded] = useState<boolean>(false);

	return (
		<ContainerWidget>
			<div className="group-project-widget-header">
				<div className="group-project-widget-title">
					<Icon icon={<FiUsers/>} color="var(--blue-col)"/>
					<div className="group-project-widget-title-right">
						<div className="group-content-title">
							<span style={{fontWeight: "var(--big-bold)"}}>{group.name}</span>
							<Tag label={GroupStatusLabel.get(group.status)} color={GroupStatusColor.get(group.status)}/>
						</div>
						<span style={{color: "var(--gray1-col)", fontWeight: "var(--small-bold)"}}>#{group.id}</span>
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
					<UserWidget user={group.leader} selected={false} crown={true}>
						<OverflowMenu options={[
							{label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => onUserDelete?.(group.leader)},
						]}/>
					</UserWidget>
					{group.members && group.members.map(member => {
						if (member.id != group.leader.id){
							return (
								<UserWidget key={member.id} user={member} selected={false} crown={false}>
									<OverflowMenu options={[
										{label: "Transfer Leadership", icon: <FaCrown/>, onClick: () => onLeader?.(member)},
										{label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => onUserDelete?.(member)},
									]}/>
								</UserWidget>
							)
						}
					})}
				</div>
			}
		</ContainerWidget>
	)
}