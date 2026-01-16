import axios, { AxiosError } from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    timeout: 10000,
});

// Types
export interface Participant {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface Message {
    id: string;
    sender: Participant;
    content: string;
    created: string;
    is_read: boolean;
}

export interface Conversation {
    id: string;
    name: string;
    is_group: boolean;
    participants: Participant[];
    last_message: Message | null;
    unread_count: number;
    created: string;
    modified: string;
}

export interface ConversationDetail {
    id: string;
    name: string;
    is_group: boolean;
    participants: Participant[];
    messages: Message[];
    created: string;
    modified: string;
}

interface ApiError {
    code: string;
    message: string;
}

// Intercepteur CSRF
api.interceptors.request.use((config) => {
    const csrfToken = localStorage.getItem("csrf_token");
    if (csrfToken && config.method !== "get") {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
});

const handleApiError = (error: AxiosError<ApiError>): never => {
    if (error.response) {
        throw new Error(error.response.data?.message || "Une erreur est survenue");
    }
    throw new Error("Erreur de connexion au serveur");
};

export const getParticipantName = (participant: Participant): string => {
    if (participant.first_name || participant.last_name) {
        return `${participant.first_name} ${participant.last_name}`.trim();
    }
    return participant.email;
};

export const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "maintenant";
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;

    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
};

export default class Chatservices {
    /**
     * Lister les conversations
     */
    public static async listConversations(): Promise<Conversation[]> {
        try {
            const response = await api.get<Conversation[]>("/chat/conversations");
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Creer une conversation
     */
    public static async createConversation(
        participantIds: string[],
        name: string = "",
        isGroup: boolean = false
    ): Promise<Conversation> {
        try {
            const response = await api.post<Conversation>("/chat/conversations", {
                participant_ids: participantIds,
                name,
                is_group: isGroup,
            });
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Obtenir une conversation avec ses messages
     */
    public static async getConversation(conversationId: string): Promise<ConversationDetail> {
        try {
            const response = await api.get<ConversationDetail>(`/chat/conversations/${conversationId}`);
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Obtenir les nouveaux messages (polling)
     */
    public static async getNewMessages(conversationId: string, afterMessageId?: string): Promise<Message[]> {
        try {
            const params = afterMessageId ? { after: afterMessageId } : {};
            const response = await api.get<Message[]>(`/chat/conversations/${conversationId}/messages`, { params });
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Envoyer un message
     */
    public static async sendMessage(conversationId: string, content: string): Promise<Message> {
        try {
            const response = await api.post<{ success: boolean; message: Message }>(
                `/chat/conversations/${conversationId}/messages`,
                { content }
            );
            return response.data.message;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Lister les utilisateurs pour demarrer une conversation
     */
    public static async listUsers(search: string = ""): Promise<Participant[]> {
        try {
            const params = search ? { search } : {};
            const response = await api.get<Participant[]>("/chat/users", { params });
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }
}
