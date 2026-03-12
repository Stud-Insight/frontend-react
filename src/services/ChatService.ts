import { AxiosError } from "axios";
import api, { errorFormat, ApiError } from "../api/ApiHandle";
import { User } from "./UserService";

export interface Message {
    id: string;
    sender: User;
    content: string;
    created: string;
    is_read: boolean;
}

export interface Conversation {
    id: string;
    name: string;
    is_group: boolean;
    participants: User[];
    last_message: Message | null;
    unread_count: number;
    created: string;
    modified: string;
}

export interface ConversationDetail {
    id: string;
    name: string;
    is_group: boolean;
    participants: User[];
    messages: Message[];
    created: string;
    modified: string;
}

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

export default class ChatService {
    public static async getAllConversations(): Promise<Conversation[]> {
        try {
            const response = await api.get<Conversation[]>("/chat/conversations");
            return response.data;
        } catch (error) {
            errorFormat(error as AxiosError<ApiError>);
        }
    }

	public static async deleteConversation(conv_id: string): Promise<void> {
		//TODO
		try {
         	await api.delete(`/chat/conversations/${conv_id}`);
        } catch (error) {
            errorFormat(error as AxiosError<ApiError>);
        }
	}
	
	public static async getConversation(conv_id: string): Promise<ConversationDetail> {
        try {
            const response = await api.get<ConversationDetail>(`/chat/conversations/${conv_id}`);
            return response.data;
        } catch (error) {
            errorFormat(error as AxiosError<ApiError>);
        }
    }

    public static async createConversation(user_ids: string[], name: string): Promise<Conversation> {
        try {
            const response = await api.post<Conversation>("/chat/conversations", {
                participant_ids: user_ids,
                name,
                is_group: user_ids.length > 1,
            });
            return response.data;
        } catch (error) {
            errorFormat(error as AxiosError<ApiError>);
        }
    }

    public static async getNewMessages(conv_id: string, afterMessageId?: string): Promise<Message[]> {
        try {
            const params = afterMessageId ? { after: afterMessageId } : {};
            const response = await api.get<Message[]>(`/chat/conversations/${conv_id}/messages`, { params });
            return response.data;
        } catch (error) {
            errorFormat(error as AxiosError<ApiError>);
        }
    }

   	public static async sendMessage(conv_id: string, content: string): Promise<void> {
		try {
			const response = await api.post(`/chat/conversations/${conv_id}/messages?content=${content}`);
		} catch (error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}

    // public static async listUsers(search: string = ""): Promise<Participant[]> {
    //     try {
    //         const params = search ? { search } : {};
    //         const response = await api.get<Participant[]>("/chat/users", { params });
    //         return response.data;
    //     } catch (error) {
    //         errorFormat(error as AxiosError<ApiError>);
    //     }
    // }
}
