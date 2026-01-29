import { AxiosError } from "axios";

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
};

export function errorFormat(error: AxiosError<ApiError>): never  {
	if (error.response) {
		throw new Error(error.message);
	} else {
		throw new Error("Erreur de connexion au serveur");
	}
};