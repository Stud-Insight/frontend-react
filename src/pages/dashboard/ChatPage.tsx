import React, { useState, useEffect, useCallback } from "react";
import DashboardPage from "./DashboardPage";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import NewChatDialog from "../../components/chat/NewChatDialog";
import ChatService, { Conversation, getParticipantName } from "../../services/ChatService";
import InfoBox from "../../components/ui/InfoBox";
import InfoWidget from "../../components/ui/InfoWidget";
import Button from "../../atoms/input/Button";

import { useAuth } from "../../context/AuthContext";
import { FiUser } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";

import "./ChatPage.css";

export default function ChatPage(){
    const { user } = useAuth();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [showNewChat, setShowNewChat] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setsuccess] = useState<string | null>(null);
	
    const loadConversations = useCallback(async () => {
        try {
            const data = await ChatService.listConversations();
            setConversations(data);
        } catch (err) {
            console.error("Error loading conversations:", err);
			setError(err);
        }
    }, []);

    useEffect(() => {
        loadConversations();

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
                const existing = prev.find((c) => c.id === conv.id);
                if (existing) {
                    return prev;
                }
                return [conv, ...prev];
            });

            setSelectedConversation(conv);
        } catch (err) {
            console.error("Error creating conversation:", err);
			setError(err);
        }
    };

    const getConversationName = (conv: Conversation): string => {
        if (conv.name) {
			return conv.name;
		}
        const other = conv.participants.find((p) => p.id !== user?.id);
        return other ? getParticipantName(other) : "Conversation";
    };

    return (
        <DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Messages</span>
				</div>
			</div>

			<span style={{color: "var(--gray1-col)"}}>Gérez et modifier votre profile.</span>


			{error && <InfoBox label={error} type="error"/>}
			{success && <InfoBox label={success} type="success"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Conversations" icon={<LuMessageSquare/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Conversation Personelle" icon={<FiUser/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Conversation Groupe" icon={<FiUsers/>} info={0} color="var(--blue-col)"/>
			</div>

			<div className="dashboard-top-layout">
				<div/>
				<div className="dashboard-top-button-layout">
					<Button icon={<FaPlus/>} label="Créer Conversation"/>
				</div>
			</div>

            <div className="chat-page">
                <ChatSidebar
                    conversations={conversations}
                    selectedId={selectedConversation?.id || null}
                    onSelect={handleSelectConversation}
                    onNewChat={() => setShowNewChat(true)}
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