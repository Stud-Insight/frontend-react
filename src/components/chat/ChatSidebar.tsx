import React from "react";
import { Conversation, getParticipantName, formatMessageTime } from "../../services/ChatService";
import { useAuth } from "../../context/AuthContext";
import "./ChatSidebar.css";

interface ChatSidebarProps {
    conversations: Conversation[];
    selectedId: string | null;
    onSelect: (conversation: Conversation) => void;
    onNewChat: () => void;
    isLoading?: boolean;
}

export default function ChatSidebar({
    conversations,
    selectedId,
    onSelect,
    onNewChat,
    isLoading = false,
}: ChatSidebarProps) {
    const { user } = useAuth();

    const getConversationName = (conv: Conversation): string => {
        if (conv.name) return conv.name;
        // For 1-on-1 conversations, show the other participant's name
        const other = conv.participants.find((p) => p.id !== user?.id);
        return other ? getParticipantName(other) : "Conversation";
    };

    const getInitials = (conv: Conversation): string => {
        const name = getConversationName(conv);
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="chat-sidebar">
            <div className="chat-sidebar-header">
                <h2>Messages</h2>
                <button className="new-chat-btn" onClick={onNewChat} title="Nouvelle conversation">
                    +
                </button>
            </div>

            <div className="chat-sidebar-list">
                {isLoading ? (
                    <div className="chat-sidebar-loading">Chargement...</div>
                ) : conversations.length === 0 ? (
                    <div className="chat-sidebar-empty">Aucune conversation</div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            className={`chat-sidebar-item ${selectedId === conv.id ? "selected" : ""}`}
                            onClick={() => onSelect(conv)}
                        >
                            <div className="chat-avatar">{getInitials(conv)}</div>
                            <div className="chat-item-content">
                                <div className="chat-item-header">
                                    <span className="chat-item-name">{getConversationName(conv)}</span>
                                    {conv.last_message && (
                                        <span className="chat-item-time">
                                            {formatMessageTime(conv.last_message.created)}
                                        </span>
                                    )}
                                </div>
                                <div className="chat-item-preview">
                                    {conv.last_message ? (
                                        <span className="chat-preview-text">
                                            {conv.last_message.sender.id === user?.id ? "Vous: " : ""}
                                            {conv.last_message.content}
                                        </span>
                                    ) : (
                                        <span className="chat-preview-empty">Pas de messages</span>
                                    )}
                                    {conv.unread_count > 0 && (
                                        <span className="chat-unread-badge">{conv.unread_count}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
