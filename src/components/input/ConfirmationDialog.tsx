import React from "react";
import ModalDialog from "./ModalDialog";
import SubmitButton from "./SubmitButton";

import "./ConfirmationDialog.css";

interface ConfirmationDialogProps {
	label?: string;
	info?: string;
	onCancel?: () => void;
	onConfirm?: () => void;
}

export default function ConfirmationDialog({label, info, onCancel, onConfirm}: ConfirmationDialogProps){
	return (
		<ModalDialog onClose={onCancel}>
			<div className="confirmation-dialog-layout">
				<label className="confirmation-dialog-titre">{label}</label>
				<label className="confirmation-dialog-info">{info}</label>
				<div className="confirmation-dialog-buttons-layout">
					<SubmitButton label="Annuler" style="cancel" onChange={onCancel}/>
					<SubmitButton label="Confirmer" style="danger" onChange={onConfirm}/>
				</div>
			</div>
		</ModalDialog>
	)
}