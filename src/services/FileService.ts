import axios, { AxiosError } from "axios";
import { errorFormat, ApiError } from "../utils/ErrorHandler";

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    timeout: 30000,
});

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

    public static async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse | null> {
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
            errorFormat(error as AxiosError<ApiError>);
        }
    }

    public static async listFiles(): Promise<Attachment[] | null> {
        try {
            // const response = await api.get<Attachment[]>("/attachments/");
            // return response.data;

			const mockFiles: Attachment[] = [
				{
					id: "1",
					original_filename: "document.pdf",
					content_type: "application/pdf",
					size: 245678,
					created: "2025-01-01T10:15:00Z",
				},
				{
					id: "2",
					original_filename: "image.png",
					content_type: "image/png",
					size: 134567,
					created: "2025-01-05T14:30:00Z",
				},
				{
					id: "3",
					original_filename: "notes.txt",
					content_type: "text/plain",
					size: 2938,
					created: "2025-01-10T09:00:00Z",
				},
			];

			return mockFiles;
        } catch (error) {
            errorFormat(error as AxiosError<ApiError>);
        }
    }

    public static async downloadFile(fileId: string, filename: string): Promise<void> {
        window.open(`${process.env.API_URL}/attachments/${fileId}/download`, "_blank");
    }

    public static async deleteFile(fileId: string): Promise<void> {
        try {
            await api.delete(`/attachments/${fileId}`);
        } catch (error) {
            errorFormat(error as AxiosError<ApiError>);
        }
    }
}
