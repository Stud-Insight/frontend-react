import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const csrfToken = localStorage.getItem("csrf_token");

    if (csrfToken && config.method !== "get") {
        config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
});

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
};

export function errorFormat(error: AxiosError<ApiError>): never {
	if (error.response) {
		throw new Error(error.message);
	} else {
		throw new Error("Erreur de connexion au serveur");
	}
};

export default api;