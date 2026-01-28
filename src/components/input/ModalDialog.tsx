import React, { useState, ReactNode }from "react";
import { RxCross2 } from "react-icons/rx";
import IconButton from "./IconButton";
import HorizontalDivider from "../ui/HorizontalDivider";

import "./ModalDialog.css";

interface ModalDialogProps {
	label?: string;
	children: ReactNode;
	width?: number;
	onClose?: () => void; 
};

export default function ModalDialog({label, onClose, children, width}: ModalDialogProps){
	const close_handler = () => {
		onClose ? onClose() : undefined;
	};

	return (
		<div className="modal-dialog-layout">
			<div className="modal-dialog-content" style={{width: width ? width : "auto"}}>
				<div className="modal-dialog-title">
					<label className="modal-dialog-label">{label}</label>
					<IconButton icon={<RxCross2/>} onClick={close_handler}/>
				</div>
				<HorizontalDivider/>
				{children}
			</div>
		</div>
	)
}