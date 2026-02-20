import React, {ReactNode} from "react";
import UserAvatar from "../ui/UserAvatar";
import { User } from "../../services/UserService";
import { MdDone } from "react-icons/md";
import { FaCrown } from "react-icons/fa";
import "./UserWidget.css"

interface UserWidgetProps {
	user: User;
	crown?: boolean;
	onClick?: () => void;
	selected?: boolean;
	children?: ReactNode;

};

export default function UserWidget({user, onClick, selected = false, crown = false, children}: UserWidgetProps){
	return (
		<div className={`user-widget-wrapper ${selected ? "selected" : ""}`} onClick={onClick}>
			<div className="user-widget-layout">
				<div className="user-widget-left">
					<UserAvatar user={user}/>
				</div>

				<div className="user-widget-right">
					<div className="user-widget-name">
						<span style={{fontWeight: "var(--big-bold)"}}>{user.first_name} {user.last_name}</span>
						{crown &&
							<FaCrown color="var(--yellow-col)"/>
						}
					</div>
					<span>#{user.id.slice(0, 8)}</span>
					<span>{user.email}</span>
				</div>
			</div>
			
			{children}
			
			<div className={`user-selected-icon ${selected ? "selected" : ""}`}>
				<MdDone/>
			</div>
		</div>
	)
}