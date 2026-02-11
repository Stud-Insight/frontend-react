import React from "react";
import ModalDialog from "./ModalDialog";
import Button from "../../atoms/input/Button";

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
					<Button label="Annuler" style="cancel" width={`${100}%`} onChange={onCancel}/>
					<Button label="Confirmer" style="danger" width={`${100}%`} onChange={onConfirm}/>
				</div>
			</div>
		</ModalDialog>
	)
}