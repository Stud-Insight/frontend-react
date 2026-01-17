import React, { useState, useEffect, useCallback } from "react";
import DashboardPage from "./DashboardPage";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import NewChatDialog from "../../components/chat/NewChatDialog";
import ChatService, { Conversation, getParticipantName } from "../../services/ChatService";
import { useAuth } from "../../context/AuthContext";
import "./ChatPage.css";

export default function ChatPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showNewChat, setShowNewChat] = useState(false);

    const loadConversations = useCallback(async () => {
        try {
            const data = await ChatService.listConversations();
            setConversations(data);
        } catch (err) {
            console.error("Error loading conversations:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadConversations();

        // Poll for new conversations/updates every 10 seconds
        const interval = setInterval(loadConversations, 10000);
        return () => clearInterval(interval);
    }, [loadConversations]);

    const handleSelectConversation = (conv: Conversation) => {
        setSelectedConversation(conv);
    };

    const handleCreateConversation = async (participantId: string) => {
        try {
            const conv = await ChatService.createConversation([participantId]);
            setConversations((prev) => {
                // Check if conversation already exists
                const existing = prev.find((c) => c.id === conv.id);
                if (existing) {
                    return prev;
                }
                return [conv, ...prev];
            });
            setSelectedConversation(conv);
        } catch (err) {
            console.error("Error creating conversation:", err);
        }
    };

    const getConversationName = (conv: Conversation): string => {
        if (conv.name) return conv.name;
        const other = conv.participants.find((p) => p.id !== user?.id);
        return other ? getParticipantName(other) : "Conversation";
    };

    return (
        <DashboardPage>
            <div className="chat-page">
                <ChatSidebar
                    conversations={conversations}
                    selectedId={selectedConversation?.id || null}
                    onSelect={handleSelectConversation}
                    onNewChat={() => setShowNewChat(true)}
                    isLoading={isLoading}
                />

                {selectedConversation ? (
                    <ChatWindow
                        conversationId={selectedConversation.id}
                        conversationName={getConversationName(selectedConversation)}
                        onBack={() => setSelectedConversation(null)}
                    />
                ) : (
                    <div className="chat-placeholder">
                        <div className="chat-placeholder-content">
                            <div className="chat-placeholder-icon">💬</div>
                            <h3>Selectionnez une conversation</h3>
                            <p>Ou commencez une nouvelle discussion</p>
                            <button onClick={() => setShowNewChat(true)}>Nouvelle conversation</button>
                        </div>
                    </div>
                )}

                <NewChatDialog
                    isOpen={showNewChat}
                    onClose={() => setShowNewChat(false)}
                    onCreateConversation={handleCreateConversation}
                />
            </div>
        </DashboardPage>
    );
}