import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage";
import { User } from "../../services/UserService";
import ChatService, { Conversation, ConversationDetail } from "../../services/ChatService";
import InfoBox from "../../components/ui/InfoBox";
import InfoWidget from "../../components/ui/InfoWidget";
import Button from "../../atoms/input/Button";
import ContainerWidget from "../../components/ui/ContainerWidget";
import UserSelectionDialog from "../../components/dialog/UserSelectionDialog";
import ConversationWidget from "../../components/objects/ConversationWidget";
import MessageWidget from "../../components/objects/MessageWidget";
import EmptyWidget from "../../components/ui/EmptyWidget";

import { FiUser } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { LuMessageSquare } from "react-icons/lu";
import InputField from "../../components/input/InputField";

import "./ChatPage.css";

export default function ChatPage(){
    const [conversations, setConversations] = useState<Conversation[]>([]);
	const [selectedConv, setSelectedConv] = useState<ConversationDetail | null>(null);
    const [showNewChat, setShowNewChat] = useState(false);
	
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [newMessage, setNewMessage] = useState<string>("");

	const conv_groupe_count = conversations.filter(conv => conv.participants.length > 2).length;
	const conv_perso_count = conversations.filter(conv => conv.participants.length == 2).length;

	const getAllConversations = async () => {
		try {
			const res = await ChatService.getAllConversations();

			if (res.length > 0) {
				getConvDetailsHandle(res[0].id);
			}

			setConversations(res);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const createNewConversation = async (users: Set<User>) => {
		setShowNewChat(false);

		try {
			const ids = Array.from(users).map(user => user.id);
			await ChatService.createConversation(ids, "");
			getAllConversations();
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	const getConvDetailsHandle = async (conv_id: string) => {
		try {
			const res = await ChatService.getConversation(conv_id);
			setSelectedConv(res);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const sendMessageHandle = async () => {
		try {
			if (selectedConv && newMessage != "") {
				await ChatService.sendMessage(selectedConv?.id, newMessage.trim());
				getConvDetailsHandle(selectedConv?.id);
				setNewMessage("");
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	useEffect(() => {
		getAllConversations();
	}, []);
	
    return (
        <DashboardPage>
			{showNewChat &&
				<UserSelectionDialog label="Creation Conversation" onClose={() => setShowNewChat(false)} onConfirm={createNewConversation}/>
			}

			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Conversations</span>
				</div>
			</div>

			<span style={{color: "var(--gray1-col)"}}>Gérez et modifiez votre profil.</span>

			{error && <InfoBox label={error} type="error"/>}
			{success && <InfoBox label={success} type="success"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Conversation Personelle" icon={<FiUser/>} info={conv_perso_count} color="var(--blue-col)"/>
				<InfoWidget label="Conversation Groupe" icon={<FiUsers/>} info={conv_groupe_count} color="var(--blue-col)"/>
			</div>

			<div className="dashboard-top-layout">
				<div/>
				<div className="dashboard-top-button-layout">
					<Button icon={<FaPlus/>} label="Créer Conversation" onClick={() => setShowNewChat(true)}/>
				</div>
			</div>

			{conversations.length > 0 ? (
				<div className="chat-layout-style">
					<ContainerWidget className="chat-sidebar-layout">
						{conversations.map(conv => (
							<ConversationWidget key={conv.id} active={conv.id == selectedConv?.id} conv={conv} onClick={() => getConvDetailsHandle(conv.id)}/>
						))}
					</ContainerWidget>
					
					<ContainerWidget className="chat-content-layout">
						{selectedConv &&
							<>
								<div className="chat-content-messages">
									{selectedConv.messages.map(message => (
										<MessageWidget key={message.id} message={message}/>
									))}
								</div>

								<div className="chat-content-footer">
									<InputField value={newMessage} onChange={setNewMessage}/>
									<Button icon={<LuSend/>}label="Envoyer" onClick={sendMessageHandle}/>
								</div>	
							</>
						}
					</ContainerWidget>
				</div>
			) : (
				<EmptyWidget icon={<LuMessageSquare size={30}/>} text="Aucune conversation pour le moment."/>
			)}
        </DashboardPage>
    );
}