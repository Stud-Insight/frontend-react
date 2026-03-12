import React from "react";
import { Group } from "../../services/UserService";
import GroupProjectWidget from "./GroupProjectWidget";

import "./GroupInvitationWidget.css";

interface GroupInvitationWidgetProps {
	group: Group
	onAccept: () => void;
	onReject: () => void;
};

export default function GroupInvitationWidget({group, onAccept, onReject}: GroupInvitationWidgetProps) {
	return (
		<div>
			<GroupProjectWidget group={group}/>
		</div>
	)
}