import { AxiosError } from "axios";
import { User } from "./UserService";
import api, { errorFormat, ApiError } from "../api/ApiHandle";

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

export default class AuthService {
    public static async getCSRFToken(): Promise<string> {
        try {
            const response = await api.get<{ csrf_token: string }>("/auth/csrf");
            const token = response.data.csrf_token;
            localStorage.setItem("csrf_token", token);
            return token;
        } catch (error) {
            errorFormat(error as AxiosError<ApiError>);
        }
    }

	private static async checkActivationToken(token: string): Promise<{ valid: boolean; email: string }> {
        try {
            const response = await api.post<{ valid: boolean; email: string }>(
                `/auth/activate/check/${token}`
            );
            return response.data;
        } catch (error) {
            errorFormat(error as AxiosError<ApiError>);
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
            errorFormat(error as AxiosError<ApiError>);
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

            errorFormat(error as AxiosError<ApiError>);
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
            errorFormat(error as AxiosError<ApiError>);
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
            errorFormat(error as AxiosError<ApiError>);
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
            errorFormat(error as AxiosError<ApiError>);
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
            errorFormat(error as AxiosError<ApiError>);
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
            errorFormat(error as AxiosError<ApiError>);
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
            errorFormat(error as AxiosError<ApiError>);
        }
    }	

	public static async updateProfile(data: { first_name?: string; last_name?: string }): Promise<User> {
        try {
            const response = await api.put<User>("/auth/me", data);
            localStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            errorFormat(error as AxiosError<ApiError>);
            throw error;
        }
    }

    public static async uploadAvatar(file: File): Promise<User> {
        try {
            await this.getCSRFToken();

            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post<User>("/auth/me/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            localStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            errorFormat(error as AxiosError<ApiError>);
            throw error;
        }
    }

    public static async deleteAvatar(): Promise<User> {
        try {
            await this.getCSRFToken();

            const response = await api.delete<User>("/auth/me/avatar");
            localStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            errorFormat(error as AxiosError<ApiError>);
            throw error;
        }
    }

    public static async changePassword(current_password: string, new_password: string): Promise<MessageResponse> {
        try {
            await this.getCSRFToken();

            const response = await api.post<MessageResponse>("/auth/password-change", {
                current_password,
                new_password,
            });

            return response.data;
        } catch (error) {
            errorFormat(error as AxiosError<ApiError>);
            throw error;
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
