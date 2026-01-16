import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import FileService from "../../services/FileService";
import "./FileUpload.css";

interface FileUploadProps {
    onUploadSuccess?: (fileId: string, filename: string) => void;
    onUploadError?: (error: string) => void;
    acceptedTypes?: string;
    maxSize?: number;
}

export default function FileUpload({
    onUploadSuccess,
    onUploadError,
    acceptedTypes = "*",
    maxSize = 50,
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFile = async (file: File) => {
        setError(null);

        const maxBytes = maxSize * 1024 * 1024;
        if (file.size > maxBytes) {
            const errorMsg = `Le fichier est trop volumineux. Taille max: ${maxSize}MB`;
            setError(errorMsg);
            onUploadError?.(errorMsg);
            return;
        }

        setIsUploading(true);
        setProgress(0);

        try {
            const response = await FileService.uploadFile(file, (p) => setProgress(p));
            setProgress(100);
            onUploadSuccess?.(response.file_id, file.name);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Erreur lors de l'upload";
            setError(errorMsg);
            onUploadError?.(errorMsg);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className={`file-upload ${isDragging ? "dragging" : ""} ${isUploading ? "uploading" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes}
                onChange={handleFileSelect}
                style={{ display: "none" }}
            />

            {isUploading ? (
                <div className="upload-progress">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="progress-text">{progress}%</span>
                </div>
            ) : (
                <div className="upload-content">
                    <div className="upload-icon">+</div>
                    <p className="upload-text">
                        Glissez un fichier ici ou <span className="upload-link">parcourir</span>
                    </p>
                    <p className="upload-hint">Taille max: {maxSize}MB</p>
                </div>
            )}

            {error && <div className="upload-error">{error}</div>}
        </div>
    );
}
