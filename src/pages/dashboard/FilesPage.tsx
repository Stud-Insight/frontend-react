import React, { useState, useEffect, useCallback } from "react";
import DashboardPage from "./DashboardPage";
import FileUpload from "../../components/file/FileUpload";
import FileList from "../../components/file/FileList";
import FileService, { Attachment } from "../../services/FileService";
import InfoBox from "../../components/ui/InfoBox";
import "./FilesPage.css";

export default function FilesPage() {
    const [files, setFiles] = useState<Attachment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
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
        setSuccessMessage(`Fichier "${filename}" uploade avec succes`);
        setTimeout(() => setSuccessMessage(null), 3000);
        loadFiles();
    };

    const handleUploadError = (errorMsg: string) => {
        setError(errorMsg);
    };

    const download_handle = (file: Attachment) => {
        FileService.downloadFile(file.id, file.original_filename);
    };

    const delete_handle = async (file: Attachment) => {
        if (!confirm(`Supprimer "${file.original_filename}" ?`)) {
            return;
        }

        try {
            await FileService.deleteFile(file.id);
            setSuccessMessage(`Fichier "${file.original_filename}" supprime`);
            setTimeout(() => setSuccessMessage(null), 3000);
            loadFiles();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
            setTimeout(() => setError(null), 5000);
        }
    };

    return (
        <DashboardPage>
            <label>Mes fichiers ({files.length})</label>

            {error && <InfoBox label={error} type="error"/>}
            {successMessage && <InfoBox label={successMessage} type="success"/>}

            <FileUpload onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} maxSize={50}/>
            {files.length > 0 && 
				<table className="file-list-table">
					<thead>
						<tr>
							<th>Nom</th>
							<th>Type</th>
							<th>Taille</th>
							<th>Date</th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{files.map((file, index) => (
							<tr key={index}>
								<td>{file.original_filename}</td>
								<td>{FileService.getFileIcon(file.content_type)}</td>
								<td>{FileService.formatFileSize(file.size)}</td>
								<td>{FileService.formatFileDate(file.created)}</td>
								<td className="file-list-table-clickable" onClick={() => download_handle(file)}>Télécharger</td>
								<td className="file-list-table-clickable" onClick={() => delete_handle(file)}>Supprimer</td>
							</tr>
						))}
					</tbody>
				</table>
			}
        </DashboardPage>
    );
}