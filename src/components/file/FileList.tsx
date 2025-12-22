import React from "react";
import { Attachment, formatFileSize, getFileIcon } from "../../service/FileService";
import "./FileList.css";

interface FileListProps {
    files: Attachment[];
    onDownload?: (file: Attachment) => void;
    onDelete?: (file: Attachment) => void;
    isLoading?: boolean;
    emptyMessage?: string;
}

export default function FileList({
    files,
    onDownload,
    onDelete,
    isLoading = false,
    emptyMessage = "Aucun fichier",
}: FileListProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <div className="file-list-loading">
                <div className="spinner"></div>
                <span>Chargement...</span>
            </div>
        );
    }

    if (files.length === 0) {
        return <div className="file-list-empty">{emptyMessage}</div>;
    }

    return (
        <div className="file-list">
            {files.map((file) => (
                <div key={file.id} className="file-item">
                    <div className="file-icon">{getFileIcon(file.content_type)}</div>
                    <div className="file-info">
                        <div className="file-name" title={file.original_filename}>
                            {file.original_filename}
                        </div>
                        <div className="file-meta">
                            <span>{formatFileSize(file.size)}</span>
                            <span className="separator">•</span>
                            <span>{formatDate(file.created)}</span>
                        </div>
                    </div>
                    <div className="file-actions">
                        {onDownload && (
                            <button
                                className="file-action-btn download"
                                onClick={() => onDownload(file)}
                                title="Télécharger"
                            >
                                ⬇️
                            </button>
                        )}
                        {onDelete && (
                            <button
                                className="file-action-btn delete"
                                onClick={() => onDelete(file)}
                                title="Supprimer"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
