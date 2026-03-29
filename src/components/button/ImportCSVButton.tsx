import React, { ReactNode, useRef, ChangeEvent } from "react";
import "./ImportCSVButton.css";
import Button from "../../atoms/input/Button";
import { CgImport } from "react-icons/cg";

interface ImportCSVButtonProps {
	label?: string;
	icon?: ReactNode;
	onSelect?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function ImportCSVButton({label="Importer CSV", icon=<CgImport/>, onSelect}: ImportCSVButtonProps){
	const inputRef = useRef<HTMLInputElement | null>(null);

	return (
		<>
			<input ref={inputRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => onSelect?.(e)}/>
			<Button icon={icon} label={label} onClick={() => inputRef.current?.click()}/>
		</>
	)
}