import axios, { AxiosError } from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    timeout: 30000,
});

// Types
export interface Attachment {
    id: string;
    original_filename: string;
    content_type: string;
    size: number;
    created: string;
}

export interface UploadResponse {
    success: boolean;
    message: string;
    file_id: string;
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

export default class FileService {
    public static formatFileSize = (bytes: number): string => {
        if (bytes === 0){
            return "0 B";
        } 

        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    public static formatFileDate = (dateString: string): string => {
        const date = new Date(dateString);

        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    public static getFileIcon = (contentType: string): string => {
        if (contentType.startsWith("image/")) return "IMG";
        if (contentType === "application/pdf") return "PDF";
        if (contentType.includes("word") || contentType.includes("document")) return "DOC";
        if (contentType.includes("excel") || contentType.includes("spreadsheet")) return "XLS";
        if (contentType.includes("powerpoint") || contentType.includes("presentation")) return "PPT";
        if (contentType.startsWith("text/")) return "TXT";
        if (contentType.includes("zip") || contentType.includes("archive")) return "ZIP";
        return "FILE";
    };

    public static async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post<UploadResponse>("/attachments/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(progress);
                    }
                },
            });

            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    public static async listFiles(): Promise<Attachment[]> {
        try {
            const response = await api.get<Attachment[]>("/attachments/");
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    public static async downloadFile(fileId: string, filename: string): Promise<void> {
        window.open(`${API_BASE_URL}/attachments/${fileId}/download`, "_blank");
    }

    public static async deleteFile(fileId: string): Promise<void> {
        try {
            await api.delete(`/attachments/${fileId}`);
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }
}
