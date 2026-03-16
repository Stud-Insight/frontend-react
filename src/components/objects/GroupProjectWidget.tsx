import React, { useState, ReactNode } from "react";
import ContainerWidget from "../ui/ContainerWidget";
import { Group, GroupStatusLabel, GroupStatusColor, GroupStatus } from "../../services/GroupService";
import Icon from "../../atoms/ui/Icon";
import OverflowMenu from "../input/OverflowMenu";
import IconButton from "../button/IconButton";
import UserWidget from "./UserWidget";
import Tag from "../../atoms/ui/Tag";
import HorizontalDivider from "../ui/HorizontalDivider";

import { FiUsers } from "react-icons/fi";
import { User } from "../../services/UserService";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaCrown } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

import "./GroupProjectWidget.css"

interface GroupProjectWidgetProps {
	label?: string;
	group: Group;
	admin?: boolean;
	active?: boolean;
	children?: ReactNode;
	forceExpanded?: boolean;
	onEdit?: () => void;
	onDelete?: () => void;
	onLeader?: (user: User) => void;
	onAdd?: () => void;
	onUserDelete?: (user: User) => void;
};

export default function GroupProjectWidget({label, group, admin = true, active = false, children, forceExpanded = false, onEdit, onDelete, onLeader, onAdd, onUserDelete}: GroupProjectWidgetProps){
	const [expanded, setExpanded] = useState<boolean>(forceExpanded);

	return (
		<ContainerWidget label={label} active={active}>
			<div className="group-project-widget-header">
				<div className="group-project-widget-title">
					<Icon icon={<FiUsers/>} color="var(--blue-col)"/>
					<div className="group-project-widget-title-right">
						<div className="group-content-title">
							<span style={{fontWeight: "var(--big-bold)"}}>{group.name}</span>
							<Tag label={GroupStatusLabel.get(group.status)} color={GroupStatusColor.get(group.status)}/>
						</div>
						{admin &&
							<span style={{color: "var(--gray1-col)", fontWeight: "var(--small-bold)"}}>#{group.id}</span>
						}
						<span className="group-project-info">{group.members ? group.members.length : 0} / {group.max_group_size}</span>
					</div>
				</div>

				{children}

				{admin &&
					<div className="group-widget-buttons-layout">
						{group.members && group.members.length > 0 &&
							<IconButton size={20} icon={expanded ? <IoIosArrowUp/> : <IoIosArrowDown/>} onClick={() => setExpanded(!expanded)}/>
						}
						<OverflowMenu options={[
							{label: "Ajouter Etudiants", icon: <FaPlus/>, onClick: () => onAdd?.()},
							{label: "Modifier", icon: <MdOutlineEdit/>, onClick: () => onEdit?.()},
							{label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => onDelete?.()},
						]}/>
					</div>	
				}
			</div>

			{expanded && group.members &&
				<div className={`group-content ${expanded ? "expanded" : ""}`}>
					{group.leader &&
						<UserWidget user={group.leader} selected={false} crown={true} showId={admin}>
							<OverflowMenu options={[
								{label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => onUserDelete?.(group.leader)},
							]}/>
						</UserWidget>
					}

					{group.members.map(member => {
						if (group.leader && member.id != group.leader.id){
							return (
								<UserWidget key={member.id} user={member} selected={false} crown={false} showId={admin}>
									<OverflowMenu options={[
										{label: "Transférer Leadership", icon: <FaCrown/>, onClick: () => onLeader?.(member)},
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