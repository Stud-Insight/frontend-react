import React, { useState, useEffect } from "react";
import ChatService, { Conversation, Message } from "../../services/ChatService";
import UserAvatar from "../ui/UserAvatar";
import { useAuth } from "../../hooks/AuthContext";
import "./ConversationWidget.css";

interface ConversationWidgetProps {
	conv: Conversation,
	active: boolean;
	onClick: () => void;
};

export default function ConversationWidget({conv, active = false, onClick}: ConversationWidgetProps) {
	const { user } = useAuth();
	const [lastMessage, setLastMessage] = useState<Message | null>(conv.last_message);
	
	return (
		<div className={`conv-layout ${active ? "active" : ""}`} onClick={onClick}>
			<UserAvatar user={conv.participants[0]} size={40}/>

			<div className="conv-content-layout">
				<div className="conv-name">
					{conv.participants.filter(parti => (parti.id != user?.id)).map(parti => (
						<span>{parti.first_name} {parti.last_name}</span>
					))}
				</div>
				
				{lastMessage 
				? 
					<div className="conv-last-message">
						<span>
							{new Date(lastMessage.created).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							})}
						</span>
						<span>
							{lastMessage.content.length <= 20 ?
								lastMessage.content
							:
								lastMessage.content.slice(0, 20) + "..."
							}
						</span>
					</div> 
				: <span className="conv-last-message">Pas de messages</span>
				}
			</div>
		</div>
	)
};