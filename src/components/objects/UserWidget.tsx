import React, {ReactNode} from "react";
import UserAvatar from "../ui/UserAvatar";
import Tag from "../../atoms/ui/Tag";
import { User, UserRolesColors, UserRolesLabels } from "../../services/UserService";
import { MdDone } from "react-icons/md";
import { FaCrown } from "react-icons/fa";
import "./UserWidget.css"

interface UserWidgetProps {
	user: User | null;
	crown?: boolean;
	showId?: boolean;
	showRoles?: boolean;
	selected?: boolean;
	children?: ReactNode;
	onClick?: () => void;
};

export default function UserWidget({user, onClick, selected = false, showRoles = false, showId = true, crown = false, children}: UserWidgetProps){
	return (
		<div className={`user-widget-wrapper ${selected ? "selected" : ""}`} onClick={onClick}>
			<div className="user-widget-layout">
				<div className="user-widget-left">
					<UserAvatar user={user}/>
				</div>

				<div className="user-widget-right">
					<div className="user-widget-name">
						<span style={{fontWeight: "var(--big-bold)"}}>{user?.first_name} {user?.last_name}</span>
						{crown &&
							<FaCrown color="var(--yellow-col)"/>
						}
						{/* {showRoles && user && user.groups.map(role => 
							<Tag label={UserRolesLabels.get(role.name)} color={UserRolesColors.get(role.name)}/>
						)} */}
					</div>
					{showId &&
						<span>#{user?.id.slice(0, 8)}</span>
					}
					<span>{user?.email}</span>
				</div>
			</div>
			
			{children}
			
			<div className={`user-selected-icon ${selected ? "selected" : ""}`}>
				<MdDone/>
			</div>
		</div>
	)
}