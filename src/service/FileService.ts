import axios, { AxiosError } from "axios";

// Configuration de l'API
const API_BASE_URL = "/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    timeout: 30000, // Plus long pour les uploads
});

// Types
export interface Attachment {
    id: string;
    original_filename: string;
    content_type: string;
    size: number;
    created: string;
}

export interface AcademicProject {
    id: string;
    student_id: string;
    referent_id: string | null;
    supervisor_id: string | null;
    subject: string;
    project_type: "MEMOIR" | "INTERNSHIP" | "SRW";
    start_date: string | null;
    end_date: string | null;
    created: string;
    modified: string;
    files: Attachment[];
}

export interface UploadResponse {
    success: boolean;
    message: string;
    file_id: string;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
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
        const apiError = error.response.data;
        throw new Error(apiError?.message || "Une erreur est survenue");
    } else if (error.request) {
        throw new Error("Erreur de connexion au serveur");
    } else {
        throw new Error("Erreur inattendue");
    }
};

// Formater la taille du fichier
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Obtenir l'icône selon le type de fichier
export const getFileIcon = (contentType: string): string => {
    if (contentType.startsWith("image/")) return "🖼️";
    if (contentType === "application/pdf") return "📄";
    if (contentType.includes("word") || contentType.includes("document")) return "📝";
    if (contentType.includes("excel") || contentType.includes("spreadsheet")) return "📊";
    if (contentType.includes("powerpoint") || contentType.includes("presentation")) return "📽️";
    if (contentType.startsWith("text/")) return "📃";
    if (contentType.includes("zip") || contentType.includes("archive")) return "📦";
    return "📎";
};

export default class FileService {
    /**
     * Upload un fichier
     */
    public static async uploadFile(
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<UploadResponse> {
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

    /**
     * Lister les fichiers de l'utilisateur
     */
    public static async listFiles(): Promise<Attachment[]> {
        try {
            const response = await api.get<Attachment[]>("/attachments/");
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Obtenir les métadonnées d'un fichier
     */
    public static async getFile(fileId: string): Promise<Attachment> {
        try {
            const response = await api.get<Attachment>(`/attachments/${fileId}`);
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Télécharger un fichier
     */
    public static async downloadFile(fileId: string, filename: string): Promise<void> {
        try {
            // Ouvrir dans un nouvel onglet pour gérer la redirection S3
            window.open(`${API_BASE_URL}/attachments/${fileId}/download`, "_blank");
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Supprimer un fichier
     */
    public static async deleteFile(fileId: string): Promise<void> {
        try {
            await api.delete(`/attachments/${fileId}`);
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Lister les projets académiques de l'utilisateur
     */
    public static async listProjects(): Promise<AcademicProject[]> {
        try {
            const response = await api.get<AcademicProject[]>("/attachments/projects");
            return response.data;
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }

    /**
     * Associer un fichier à un projet
     */
    public static async attachFileToProject(projectId: string, fileId: string): Promise<void> {
        try {
            await api.post(`/attachments/projects/${projectId}/attach/${fileId}`);
        } catch (error) {
            handleApiError(error as AxiosError<ApiError>);
        }
    }
}
