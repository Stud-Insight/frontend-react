import { AxiosError } from "axios";
import api, { errorFormat, ApiError } from "../api/ApiHandle";

export interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    isRead: boolean;
};

export default class NotificationService {
	public static async getUserNotifications(): Promise<Notification[]>{
		try {
			//TODO: api call ici
			return [
				{ 
					id: "1", 
					title: "Nouveau TER", 
					message: "Un nouveau sujet sur l'IA est disponible.", 
					date: "2026-02-08 10:00", 
					isRead: false 
				},
				{ 
					id: "2", 
					title: "Stage Validé", 
					message: "Votre convention a été signée par l'administration.", 
					date: "2026-02-07 14:30", 
					isRead: true 
				}
			];
		} catch(error) {
			errorFormat(error as AxiosError<ApiError>);
		}
	}
};