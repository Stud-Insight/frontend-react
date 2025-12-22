import React, { useState, useEffect, useCallback } from "react";
import DashboardPage from "./DashboardPage";
import FileUpload from "../../components/file/FileUpload";
import FileList from "../../components/file/FileList";
import FileService, { Attachment } from "../../service/FileService";
import "./FilesPage.css";

export default function FilesPage() {
    const [files, setFiles] = useState<Attachment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const loadFiles = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await FileService.listFiles();
            setFiles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors du chargement");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    const handleUploadSuccess = (fileId: string, filename: string) => {
        setSuccessMessage(`Fichier "${filename}" uploadé avec succès`);
        setTimeout(() => setSuccessMessage(null), 3000);
        loadFiles();
    };

    const handleUploadError = (errorMsg: string) => {
        setError(errorMsg);
        setTimeout(() => setError(null), 5000);
    };

    const handleDownload = (file: Attachment) => {
        FileService.downloadFile(file.id, file.original_filename);
    };

    const handleDelete = async (file: Attachment) => {
        if (!confirm(`Supprimer "${file.original_filename}" ?`)) {
            return;
        }

        try {
            await FileService.deleteFile(file.id);
            setSuccessMessage(`Fichier "${file.original_filename}" supprimé`);
            setTimeout(() => setSuccessMessage(null), 3000);
            loadFiles();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
            setTimeout(() => setError(null), 5000);
        }
    };

    return (
        <DashboardPage>
            <div className="files-page">
                {error && <div className="files-message error">{error}</div>}
                {successMessage && <div className="files-message success">{successMessage}</div>}

                <div className="files-section">
                    <h2>Uploader un fichier</h2>
                    <FileUpload
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                        maxSize={50}
                    />
                </div>

                <div className="files-section">
                    <h2>Mes fichiers ({files.length})</h2>
                    <FileList
                        files={files}
                        isLoading={isLoading}
                        onDownload={handleDownload}
                        onDelete={handleDelete}
                        emptyMessage="Vous n'avez pas encore de fichiers"
                    />
                </div>
            </div>
        </DashboardPage>
    );
}
