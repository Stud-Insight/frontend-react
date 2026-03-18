import React, {ReactNode} from "react";

import "./EmptyWidget.css"

interface EmptyWidgetProps {
	icon: ReactNode;
	text: string;
}
export default function EmptyWidget({ icon, text}: EmptyWidgetProps) {
	return (
		<div className="empty-container-layout">
			{icon}
			<span>{text}</span>
		</div>
	)
}