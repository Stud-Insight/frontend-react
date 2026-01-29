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
		<ModalDialog onClose={onCancel} width={500} label={label}>
			<div className="confirmation-dialog-layout">
				<label className="confirmation-dialog-info">{info}</label>
				<div className="confirmation-dialog-buttons-layout">
					<SubmitButton label="Annuler" style="cancel" width={`${100}%`} onChange={onCancel}/>
					<SubmitButton label="Confirmer" style="danger" width={`${100}%`} onChange={onConfirm}/>
				</div>
			</div>
		</ModalDialog>
	)
}