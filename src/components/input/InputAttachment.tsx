import React, { ReactNode, useState, useRef, ChangeEvent, useEffect } from "react";
import Field from "../../atoms/input/Field";
import LinkButton from "../button/LinkButton";
import FileService from "../../services/FileService"
import IconButton from "../button/IconButton";

import { FaRegFile, FaRegFilePdf, FaRegFileArchive, FaRegFileAudio, FaRegFileImage } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

import "./InputAttachment.css"

interface InputAttachmentProps {
	label?: string;
	icon?: ReactNode;
	accept?: string;
	files?: File[];
	onChange?: (e: File[]) => void;
	onDelete?: (e: File) => void;
};

interface FileWidgetProps {
	file: File;
	onDelete?: (file: File) => void;
};

function FileWidget({file, onDelete}: FileWidgetProps){
	const getApproIcon = () => {
		if (file.name.endsWith(".pdf")){
			return <FaRegFilePdf/>
		}

		if (file.name.endsWith(".mp3") || file.name.endsWith(".mp4") || file.name.endsWith(".ogg")){
			return <FaRegFileAudio/>
		}

		if (file.name.endsWith(".zip") || file.name.endsWith(".tgz")){
			return <FaRegFileArchive/>
		}

		if (file.name.endsWith(".png") || file.name.endsWith(".jpg") || file.name.endsWith(".svg")){
			return <FaRegFileImage/>
		}

		return <FaRegFile/>
	};	

	return (
		<div className="input-file-widget-super-layout">
			<div className="input-file-widget-layout">
				{getApproIcon()}

				<div className="input-file-widget-info-layout">
					<span>{file.name}</span>
					<span>{FileService.formatFileSize(file.size)}</span>
				</div>
			</div>

			<IconButton icon={<RxCross2/>} onClick={onDelete ?() => onDelete(file) : undefined}/>
		</div>
	)
};

export default function InputAttachment({label, icon, files, accept="", onChange, onDelete}: InputAttachmentProps){
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isOverDrag, setIsOverDrag] = useState<boolean>(false);

	const handleFileChange = (fileList: FileList) => {
		const filesArray = Array.from(fileList);
		onChange ? onChange(filesArray): undefined;
	};

	return (
		<div className="input-attachement-main-layout"
			onDragEnter={(e) => {
				e.preventDefault();
			}}

			onDragOver={(e) => {
				e.preventDefault();
				setIsOverDrag(true);
			}}

			onDragLeave={(e) => {
				e.preventDefault();
				setIsOverDrag(false);
			}}

			onDrop={(e) => {
				e.preventDefault();
				setIsOverDrag(false);
				handleFileChange(e.dataTransfer.files);
			}}
		>
			<Field label={label} icon={icon} className={`input-attachement-style ${isOverDrag ? "active" : undefined}`}>
				<div>
					<span>Drag & drop ou  </span>
					<LinkButton label="Fichiers" onClick={() => inputRef.current?.click()}/>
				</div>

				<input ref={inputRef} type="file" style={{display: "none"}} onChange={(e) => handleFileChange(e.target.files)} accept={accept}/>
			</Field>
			

			{files && files.length > 0 && 
				<Field className="input-file-list-layout">
					{files?.map((file, index) => (
						<FileWidget key={index} file={file} onDelete={onDelete ? (() => onDelete(file)) : undefined}/>
					))}
				</Field>
			}
		</div>
	)
};