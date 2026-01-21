import React, { useState, ReactNode }from "react";
import { RxCross2 } from "react-icons/rx";
import IconButton from "./IconButton";

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
				<div className="modal-exit-button">
					<IconButton icon={<RxCross2/>} onClick={close_handler}/>
				</div>
				
				<div className="modal-dialog-content2">
					<label>{label}</label>
					{children}
				</div>
			</div>
		</div>
	)
}