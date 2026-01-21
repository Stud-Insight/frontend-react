import React, { useState, ReactNode }from "react";
import { RxCross2 } from "react-icons/rx";

import "./ModalDialog.css";

interface ModalInterface {
	label?: string;
	children: ReactNode;
	onClose?: () => void; 
};

export default function ModalDialog({label, onClose, children}: ModalInterface){
	const close_handler = () => {
		onClose ? onClose() : undefined;
	};

	return (
		<div className="modal-dialog-layout">
			<div className="modal-dialog-content">
				<RxCross2 className="modal-title-close" onClick={close_handler} />

				<div className="modal-dialog-content2">
					<label>{label}</label>
					{children}
				</div>
			</div>
		</div>
	)
}