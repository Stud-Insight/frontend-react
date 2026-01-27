import axios, { AxiosError } from "axios";
import { User } from "./UserService";

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    timeout: 10000,
});

export interface LoginResponse {
    success: boolean;
    user: User;
    csrf_token: string;
};

export interface MessageResponse {
    success: boolean;
    message: string;
};

export interface SignupResponse {
    success: boolean;
    message: string;
    requires_email_verification: boolean;
};

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
};

api.interceptors.request.use((config) => {
    const csrfToken = localStorage.getItem("csrf_token");
    if (csrfToken && config.method !== "get") {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
});

const error_formatting = (error: AxiosError<ApiError>): never => {
    if (error.response) {
        throw new Error(error.message);
    } else {
        throw new Error("Erreur de connexion au serveur");
    }
};

export default class AuthService {
    public static async getCSRFToken(): Promise<string> {
        try {
            const response = await api.get<{ csrf_token: string }>("/auth/csrf");
            const token = response.data.csrf_token;
            localStorage.setItem("csrf_token", token);
            return token;
        } catch (error) {
            error_formatting(error as AxiosError<ApiError>);
        }
    }

	private static async checkActivationToken(token: string): Promise<{ valid: boolean; email: string }> {
        try {
            const response = await api.post<{ valid: boolean; email: string }>(
                `/auth/activate/check/${token}`
            );
            return response.data;
        } catch (error) {
            error_formatting(error as AxiosError<ApiError>);
        }
    }

    public static async login(email: string, password: string): Promise<LoginResponse> {
        try {
            await this.getCSRFToken();

            const response = await api.post<LoginResponse>("/auth/login", {
                email,
                password,
            });
            
            if (response.data.csrf_token) {
                localStorage.setItem("csrf_token", response.data.csrf_token);
            }

            localStorage.setItem("user", JSON.stringify(response.data.user));

            return response.data;
        } catch (error) {
            console.log(error);
            error_formatting(error as AxiosError<ApiError>);
        }
    }

    public static async logout(): Promise<MessageResponse> {
        try {
            const response = await api.post<MessageResponse>("/auth/logout");
            localStorage.removeItem("user");
            localStorage.removeItem("csrf_token");

            return response.data;
        } catch (error) {
            localStorage.removeItem("user");
            localStorage.removeItem("csrf_token");

            error_formatting(error as AxiosError<ApiError>);
        }
    }

    public static async signup(email: string, password: string, firstName: string, lastName: string): Promise<SignupResponse> {
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
            error_formatting(error as AxiosError<ApiError>);
        }
    }

    public static async requestPasswordReset(email: string): Promise<MessageResponse> {
        try {
            await this.getCSRFToken();

            const response = await api.post<MessageResponse>("/auth/password-reset", {
                email,
            });

            return response.data;
        } catch (error) {
            error_formatting(error as AxiosError<ApiError>);
        }
    }

    public static async confirmPasswordReset(uid: string, token: string, newPassword: string): Promise<MessageResponse> {
        try {
            await this.getCSRFToken();

            const response = await api.post<MessageResponse>("/auth/password-reset/confirm", {
                uid,
                token,
                new_password: newPassword,
            });

            return response.data;
        } catch (error) {
            error_formatting(error as AxiosError<ApiError>);
        }
    }

    public static async changePassword(currentPassword: string, newPassword: string): Promise<MessageResponse> {
        try {
            const response = await api.post<MessageResponse>("/auth/password-change", {
                current_password: currentPassword,
                new_password: newPassword,
            });

            return response.data;
        } catch (error) {
            error_formatting(error as AxiosError<ApiError>);
        }
    }

    public static async activateAccount(token: string, password: string): Promise<MessageResponse> {
        try {
            await this.getCSRFToken();

            const response = await api.post<MessageResponse>(`/auth/activate/${token}`, {
                password,
            });

            return response.data;
        } catch (error) {
            error_formatting(error as AxiosError<ApiError>);
        }
    }

    public static async resendActivation(email: string): Promise<MessageResponse> {
        try {
            await this.getCSRFToken();

            const response = await api.post<MessageResponse>("/auth/resend-activation", {
                email,
            });

            return response.data;
        } catch (error) {
            error_formatting(error as AxiosError<ApiError>);
        }
    }	

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

    public static isLoggedIn(): boolean {
        return localStorage.getItem("user") !== null;
    }

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
};
