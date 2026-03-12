import React from "react";
import { Message } from "../../services/ChatService";
import { useAuth } from "../../context/AuthContext";
import UserAvatar from "../ui/UserAvatar";

import "./MessageWidget.css"

interface MessageWidgetProps {
	message: Message;
}

export default function MessageWidget({message}: MessageWidgetProps) {
	const { user } = useAuth();

	const mine = message.sender.id == user?.id;

	return (
		<div className={`message-layout ${mine ? "right" : "left"}`}>
			{message.sender.id != user?.id && 
				<UserAvatar user={message.sender} size={40}/>
			}

			<div className="message-content-layout">
				<span className="message-style-content">{message.content}</span>
				<span className={`message-style-date ${mine ? "right" : "left"}`}>
					{new Date(message.created).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit"
					})}
				</span>
			</div>
		</div>
	)
}