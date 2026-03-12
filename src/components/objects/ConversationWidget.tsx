import React, { useState, useEffect } from "react";
import ChatService, { Conversation, Message } from "../../services/ChatService";
import UserAvatar from "../ui/UserAvatar";

import "./ConversationWidget.css";

interface ConversationWidgetProps {
	conv: Conversation,
	active: boolean;
	onClick: () => void;
};

export default function ConversationWidget({conv, active = false, onClick}: ConversationWidgetProps) {
	const [lastMessage, setLastMessage] = useState<Message | null>(conv.last_message);
	
	return (
		<div className={`chat-conv-layout ${active ? "active" : ""}`} onClick={onClick}>
			<UserAvatar user={conv.participants[0]} size={40}/>

			<div className="chat-conv-content-layout">
				<span>{conv.participants[0].first_name} {conv.participants[0].last_name}</span>
				{lastMessage && 
					<span>
						{new Date(lastMessage.created).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit"
						})}
					</span>	
				}
			</div>
		</div>
	)
};