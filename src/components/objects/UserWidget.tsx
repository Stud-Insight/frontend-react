import React from "react";
import UserAvatar from "../ui/UserAvatar";
import { User } from "../../services/UserService";
import { MdDone } from "react-icons/md";
import IconButton from "../button/IconButton";
import { MdDeleteOutline } from "react-icons/md";
import { FaCrown } from "react-icons/fa6";
import "./UserWidget.css"

interface UserWidgetProps {
	user: User;
	onClick?: () => void;
	onDelete?: () => void;
	selected?: boolean;
	isLeader?: boolean;

};

export default function UserWidget({user, onClick, selected = true, isLeader = false, onDelete}: UserWidgetProps){
	return (
		<div className={`user-widget-wrapper ${selected ? "selected" : ""}`} onClick={onClick}>
			<div className="user-widget-layout">
				<div className="user-widget-left">
					<UserAvatar user={user}/>
				</div>

				<div className="user-widget-right">
					<div className="user-widget-name">
						<span style={{fontWeight: "var(--big-bold)"}}>{user.first_name} {user.last_name}</span>
						{isLeader &&
							<FaCrown color="var(--yellow-col)"/>
						}
					</div>
					<span>#{user.id.slice(0, 8)}</span>
					<span>{user.email}</span>
				</div>
			</div>
		
			{onDelete &&
				<IconButton icon={<MdDeleteOutline/>} onClick={onDelete}/>
			}

			<div className={`user-selected-icon ${selected ? "selected" : undefined}`}>
				<MdDone/>
			</div>
		</div>
	)
}