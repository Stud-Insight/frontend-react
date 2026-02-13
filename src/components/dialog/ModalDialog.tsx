import React, { useState, ReactNode }from "react";
import { RxCross2 } from "react-icons/rx";
import IconButton from "../button/IconButton";
import HorizontalDivider from "../ui/HorizontalDivider";

import "./ModalDialog.css";

interface ModalDialogProps {
	label?: string;
	children: ReactNode;
	className?: string;
	onClose?: () => void; 
};

export default function ModalDialog({label, onClose, children, className}: ModalDialogProps){
	const closeHandler = () => {
		onClose ? onClose() : undefined;
	};

	return (
		<div className="modal-dialog-layout">
			<div className={`modal-dialog-content ${className}`}>
				<div className="modal-dialog-title">
					<span className="modal-dialog-label">{label}</span>
					<IconButton icon={<RxCross2/>} onClick={closeHandler}/>
				</div>
				<HorizontalDivider/>
				<div id="content">
					{children}
				</div>
			</div>
		</div>
	)
}