import React, { useState, useEffect, useRef, useCallback } from "react";
import ChatService, { Message, ConversationDetail, getParticipantName } from "../../services/ChatService";
import { useAuth } from "../../context/AuthContext";
import "./ChatWindow.css";

interface ChatWindowProps {
    conversationId: string;
    conversationName: string;
    onBack?: () => void;
}

export default function ChatWindow({ conversationId, conversationName, onBack }: ChatWindowProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastMessageIdRef = useRef<string | null>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadConversation = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await ChatService.getConversation(conversationId);
            setMessages(data.messages);
            if (data.messages.length > 0) {
                lastMessageIdRef.current = data.messages[data.messages.length - 1].id;
            }
        } catch (err) {
            console.error("Error loading conversation:", err);
        } finally {
            setIsLoading(false);
        }
    }, [conversationId]);

    const pollNewMessages = useCallback(async () => {
        if (!lastMessageIdRef.current) return;

        try {
            const newMessages = await ChatService.getNewMessages(conversationId, lastMessageIdRef.current);
            if (newMessages.length > 0) {
                setMessages((prev) => [...prev, ...newMessages]);
                lastMessageIdRef.current = newMessages[newMessages.length - 1].id;
            }
        } catch (err) {
            console.error("Error polling messages:", err);
        }
    }, [conversationId]);

    useEffect(() => {
        loadConversation();

        // Start polling for new messages
        pollingIntervalRef.current = setInterval(pollNewMessages, 3000);

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [loadConversation, pollNewMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            const message = await ChatService.sendMessage(conversationId, newMessage.trim());
            setMessages((prev) => [...prev, message]);
            lastMessageIdRef.current = message.id;
            setNewMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setIsSending(false);
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Aujourd'hui";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Hier";
        }
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        });
    };

    const shouldShowDate = (index: number): boolean => {
        if (index === 0) return true;
        const current = new Date(messages[index].created).toDateString();
        const previous = new Date(messages[index - 1].created).toDateString();
        return current !== previous;
    };

    return (
        <div className="chat-window">
            <div className="chat-window-header">
                {onBack && (
                    <button className="chat-back-btn" onClick={onBack}>
                        &larr;
                    </button>
                )}
                <h3>{conversationName}</h3>
            </div>

            <div className="chat-messages">
                {isLoading ? (
                    <div className="chat-loading">Chargement...</div>
                ) : messages.length === 0 ? (
                    <div className="chat-empty">Aucun message. Commencez la conversation !</div>
                ) : (
                    messages.map((msg, index) => (
                        <React.Fragment key={msg.id}>
                            {shouldShowDate(index) && (
                                <div className="chat-date-separator">
                                    <span>{formatDate(msg.created)}</span>
                                </div>
                            )}
                            <div
                                className={`chat-message ${msg.sender.id === user?.id ? "own" : "other"}`}
                            >
                                {msg.sender.id !== user?.id && (
                                    <div className="chat-message-sender">
                                        {getParticipantName(msg.sender)}
                                    </div>
                                )}
                                <div className="chat-message-bubble">
                                    <p>{msg.content}</p>
                                    <span className="chat-message-time">{formatTime(msg.created)}</span>
                                </div>
                            </div>
                        </React.Fragment>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSend}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    disabled={isSending}
                />
                <button type="submit" disabled={!newMessage.trim() || isSending}>
                    {isSending ? "..." : "Envoyer"}
                </button>
            </form>
        </div>
    );
}
