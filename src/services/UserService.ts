import axios, { AxiosError } from "axios";

// Configuration de l'API
// Use relative URL to go through nginx proxy (same-origin for cookies)

//const API_BASE_URL = "/api";
const API_BASE_URL = "http://localhost:8080/api"

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Pour envoyer les cookies de session
    timeout: 10000,
});

// Types
export interface Group {
    name: string;
    permissions: string[];
}

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    groups: Group[];
    is_staff: boolean;
    is_superuser: boolean;
}

export interface LoginResponse {
    success: boolean;
    user: User;
    csrf_token: string;
}

export interface MessageResponse {
    success: boolean;
    message: string;
}

export interface SignupResponse {
    success: boolean;
    message: string;
    requires_email_verification: boolean;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
}

// Intercepteur pour ajouter le CSRF token
api.interceptors.request.use((config) => {
    const csrfToken = localStorage.getItem("csrf_token");
    if (csrfToken && config.method !== "get") {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
});

// Gestion des erreurs
const handleApiError = (error: AxiosError<ApiError>): never => {
    if (error.response) {
        const message = error.response.data?.detail?.[0]?.msg
        throw new Error(message);
    } else if (error.request) {
        throw new Error("Erreur de connexion au serveur");
    } else {
        throw new Error("Erreur inattendue");
    }
};

export default class Userservices {
    /**
     * Obtenir un token CSRF
     */
    public static async getCSRFToken(): Promise<string> {
        try {
            const response = await api.get<{ csrf_token: string }>("/auth/csrf");
            const token = response.data.csrf_token;
            localStorage.setItem("csrf_token", token);
            return token;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Connexion avec email et mot de passe
     */
    public static async login(email: string, password: string): Promise<LoginResponse> {
        try {
            // Obtenir un CSRF token d'abord
            await this.getCSRFToken();

            const response = await api.post<LoginResponse>("/auth/login", {
                email,
                password,
            });

            // Sauvegarder le nouveau CSRF token
            if (response.data.csrf_token) {
                localStorage.setItem("csrf_token", response.data.csrf_token);
            }

            // Sauvegarder les infos utilisateur
            localStorage.setItem("user", JSON.stringify(response.data.user));

            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Deconnexion
     */
    public static async logout(): Promise<MessageResponse> {
        try {
            const response = await api.post<MessageResponse>("/auth/logout");

            // Nettoyer le localStorage
            localStorage.removeItem("user");
            localStorage.removeItem("csrf_token");

            return response.data;
        } catch (error) {
            // Nettoyer quand meme en cas d'erreur
            localStorage.removeItem("user");
            localStorage.removeItem("csrf_token");
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Obtenir l'utilisateur courant
     */
    public static async getCurrentUser(): Promise<User | null> {
        try {
            const response = await api.get<User>("/auth/me");
            localStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            localStorage.removeItem("user");
            return null;
        }
    }

    /**
     * Inscription
     */
    public static async signup(
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ): Promise<SignupResponse> {
        try {
            await this.getCSRFToken();

            const response = await api.post<SignupResponse>("/auth/signup", {
                email,
                password,
                first_name: firstName,
                last_name: lastName,
            });

            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Demander la reinitialisation du mot de passe
     */
    public static async requestPasswordReset(email: string): Promise<MessageResponse> {
        try {
            await this.getCSRFToken();

            const response = await api.post<MessageResponse>("/auth/password-reset", {
                email,
            });

            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Confirmer la reinitialisation du mot de passe
     */
    public static async confirmPasswordReset(
        uid: string,
        token: string,
        newPassword: string
    ): Promise<MessageResponse> {
        try {
            await this.getCSRFToken();

            const response = await api.post<MessageResponse>("/auth/password-reset/confirm", {
                uid,
                token,
                new_password: newPassword,
            });

            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Changer le mot de passe (utilisateur connecte)
     */
    public static async changePassword(
        currentPassword: string,
        newPassword: string
    ): Promise<MessageResponse> {
        try {
            const response = await api.post<MessageResponse>("/auth/password-change", {
                current_password: currentPassword,
                new_password: newPassword,
            });

            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Verifier un token d'activation
     */
    public static async checkActivationToken(token: string): Promise<{ valid: boolean; email: string }> {
        try {
            const response = await api.post<{ valid: boolean; email: string }>(
                `/auth/activate/check/${token}`
            );
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Activer le compte avec un mot de passe
     */
    public static async activateAccount(token: string, password: string): Promise<MessageResponse> {
        try {
            await this.getCSRFToken();

            const response = await api.post<MessageResponse>(`/auth/activate/${token}`, {
                password,
            });

            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Renvoyer l'email d'activation
     */
    public static async resendActivation(email: string): Promise<MessageResponse> {
        try {
            await this.getCSRFToken();

            const response = await api.post<MessageResponse>("/auth/resend-activation", {
                email,
            });

            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Verifier si l'utilisateur est connecte (depuis localStorage)
     */
    public static isLoggedIn(): boolean {
        return localStorage.getItem("user") !== null;
    }

    /**
     * Obtenir l'utilisateur depuis localStorage
     */
    public static getStoredUser(): User | null {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                return JSON.parse(userStr) as User;
            } catch {
                return null;
            }
        }
        return null;
    }
}
