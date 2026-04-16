import React, { useState, useEffect } from "react";
import { TERPeriod } from "../../../services/TERService";
import GroupService, { Group } from "../../../services/GroupService";
import DeliverableService, { Deliverable, DeliverableType, DeliverableTypeLabel } from "../../../services/DeliverableService";
import FileService from "../../../services/FileService";
import ContainerWidget from "../../../components/ui/ContainerWidget";
import InputAttachment from "../../../components/input/InputAttachment";
import InputField from "../../../components/input/InputField";
import InputDropdown from "../../../components/input/InputDropdown";
import Button from "../../../atoms/input/Button";
import IconButton from "../../../components/button/IconButton";
import ConfirmationDialog from "../../../components/dialog/ConfirmationDialog";

import { FaRegFile } from "react-icons/fa";
import { LuUpload, LuDownload } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

import "./TERExecutionView.css";

interface TERExecutionViewProps {
	period: TERPeriod;
	setError: (error: string) => void;
	setSuccess: (success: string) => void;
}

const TYPE_OPTIONS = [
	DeliverableTypeLabel[DeliverableType.REPORT],
	DeliverableTypeLabel[DeliverableType.CODE],
	DeliverableTypeLabel[DeliverableType.PRESENTATION],
	DeliverableTypeLabel[DeliverableType.OTHER],
];

const labelToType = (label: string): DeliverableType => {
	const entry = Object.entries(DeliverableTypeLabel).find(([, v]) => v === label);
	return (entry?.[0] as DeliverableType) ?? DeliverableType.OTHER;
};

export default function TERExecutionView({ period, setError, setSuccess }: TERExecutionViewProps) {
	const [myGroup, setMyGroup] = useState<Group | null>(null);
	const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
	const [file, setFile] = useState<File | null>(null);
	const [typeLabel, setTypeLabel] = useState<string>(DeliverableTypeLabel[DeliverableType.OTHER]);
	const [description, setDescription] = useState<string>("");
	const [uploading, setUploading] = useState<boolean>(false);
	const [toDelete, setToDelete] = useState<Deliverable | null>(null);

	const getDeliverables = async (groupId: string) => {
		try {
			const res = await DeliverableService.listGroupDeliverables(groupId);
			setDeliverables(res);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	useEffect(() => {
		const getMyGroup = async () => {
			try {
				const res = await GroupService.getMyGroup(period.id);
				setMyGroup(res);
				if (res) {
					getDeliverables(res.id);
				}
			} catch (err) {
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		};

		getMyGroup();
	}, []);

	const uploadHandle = async () => {
		if (!file || !myGroup) return;

		setUploading(true);
		try {
			await DeliverableService.uploadDeliverable(myGroup.id, file, labelToType(typeLabel), description, false);
			setSuccess(`Livrable '${file.name}' téléversé avec succès !`);
			setTimeout(() => setSuccess(""), 5000);
			setFile(null);
			setDescription("");
			getDeliverables(myGroup.id);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		} finally {
			setUploading(false);
		}
	};

	const deleteHandle = async () => {
		if (!toDelete || !myGroup) return;

		try {
			await DeliverableService.deleteDeliverable(toDelete.id);
			setSuccess(`Livrable '${toDelete.original_filename}' supprimé.`);
			setTimeout(() => setSuccess(""), 5000);
			setToDelete(null);
			getDeliverables(myGroup.id);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	if (!myGroup) {
		return <span style={{ color: "var(--gray1-col)" }}>Vous n'avez pas de groupe pour cette période TER.</span>;
	}

	return (
		<div className="ter-execution-layout">
			{toDelete && (
				<ConfirmationDialog
					label="Supprimer le livrable ?"
					info={`Êtes-vous sûr de vouloir supprimer le livrable "${toDelete.original_filename}" ?`}
					onCancel={() => setToDelete(null)}
					onConfirm={deleteHandle}
				/>
			)}

			<ContainerWidget icon={<LuUpload />} label="Déposer un livrable">
				<div className="ter-execution-upload-form">
					<InputAttachment
						files={file ? [file] : []}
						onChange={(files) => setFile(files[0] ?? null)}
						onDelete={() => setFile(null)}
					/>

					<InputDropdown label="Type" options={TYPE_OPTIONS} value={typeLabel} onSelect={setTypeLabel} />

					<InputField label="Description" value={description} onChange={setDescription} placeholder="Optionnel" />

					<Button
						icon={<LuUpload />}
						label={uploading ? "Envoi en cours..." : "Téléverser"}
						onClick={uploadHandle}
					/>
				</div>
			</ContainerWidget>

			<ContainerWidget icon={<FaRegFile />} label={`Livrables du groupe (${deliverables.length})`}>
				{deliverables.length === 0 ? (
					<span style={{ color: "var(--gray1-col)" }}>Aucun livrable déposé pour le moment.</span>
				) : (
					<div className="ter-execution-deliverable-list">
						{deliverables.map((d) => (
							<div key={d.id} className="ter-execution-deliverable-item">
								<FaRegFile />
								<div className="ter-execution-deliverable-info">
									<span className="ter-execution-deliverable-name">{d.original_filename}</span>
									<span className="ter-execution-deliverable-meta">
										{DeliverableTypeLabel[d.deliverable_type as DeliverableType] ?? d.deliverable_type}
										{" · "}
										{FileService.formatFileSize(d.size)}
										{" · "}
										{FileService.formatFileDate(d.created)}
									</span>
								</div>
								<IconButton icon={<LuDownload />} onClick={() => DeliverableService.downloadDeliverable(d.id)} />
								<IconButton icon={<MdDeleteOutline />} onClick={() => setToDelete(d)} />
							</div>
						))}
					</div>
				)}
			</ContainerWidget>
		</div>
	);
}
