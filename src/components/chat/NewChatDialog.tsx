import React, { useState, useEffect } from "react";
import ChatService, { Participant, getParticipantName } from "../../service/ChatService";
import "./NewChatDialog.css";

interface NewChatDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateConversation: (participantId: string) => void;
}

export default function NewChatDialog({ isOpen, onClose, onCreateConversation }: NewChatDialogProps) {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<Participant[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSearch("");
            setUsers([]);
            return;
        }

        const loadUsers = async () => {
            setIsLoading(true);
            try {
                const data = await ChatService.listUsers(search);
                setUsers(data);
            } catch (err) {
                console.error("Error loading users:", err);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(loadUsers, 300);
        return () => clearTimeout(debounce);
    }, [isOpen, search]);

    if (!isOpen) return null;

    const handleSelect = (user: Participant) => {
        onCreateConversation(user.id);
        onClose();
    };

    return (
        <div className="new-chat-overlay" onClick={onClose}>
            <div className="new-chat-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="new-chat-header">
                    <h3>Nouvelle conversation</h3>
                    <button className="new-chat-close" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="new-chat-search">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un utilisateur..."
                        autoFocus
                    />
                </div>

                <div className="new-chat-users">
                    {isLoading ? (
                        <div className="new-chat-loading">Chargement...</div>
                    ) : users.length === 0 ? (
                        <div className="new-chat-empty">
                            {search ? "Aucun utilisateur trouve" : "Aucun utilisateur disponible"}
                        </div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.id}
                                className="new-chat-user"
                                onClick={() => handleSelect(user)}
                            >
                                <div className="new-chat-avatar">
                                    {getParticipantName(user).substring(0, 2).toUpperCase()}
                                </div>
                                <div className="new-chat-user-info">
                                    <span className="new-chat-user-name">{getParticipantName(user)}</span>
                                    <span className="new-chat-user-email">{user.email}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
