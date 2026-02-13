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
		<ModalDialog onClose={onCancel} label={label} className="confirmation-dialog-layout-layout">
			<div className="confirmation-dialog-layout">
				<span>{info}</span>

				<div id="button-content">
					<Button label="Annuler" style="cancel" onClick={onCancel}/>
					<Button label="Confirmer" style="danger" onClick={onConfirm}/>
				</div>
			</div>
		</ModalDialog>
	)
}