import React from "react";
import { Group } from "../../services/UserService";
import GroupProjectWidget from "./GroupProjectWidget";
import Button from "../../atoms/input/Button";


import "./GroupInvitationWidget.css";

interface GroupInvitationWidgetProps {
	group: Group
	onAccept: () => void;
	onReject: () => void;
};

export default function GroupInvitationWidget({group, onAccept, onReject}: GroupInvitationWidgetProps) {
	return (
		<div>
			<GroupProjectWidget group={group} admin={false}>
				<div className="group-inv-button-layout">
					<Button label="Refuser" color="var(--red-col)" onClick={onReject}/>
					<Button label="Accepter" onClick={onAccept}/>
				</div>
			</GroupProjectWidget>
		</div>
	)
}