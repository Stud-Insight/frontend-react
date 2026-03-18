import React, { useState, useRef, useEffect, ReactNode } from "react";
import Field from "../../atoms/input/Field";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import IconButton from "../button/IconButton";

import "./InputDropdown.css"

interface InputDropdownProps {
	label?: string;
	icon?: ReactNode;
	defaultIndex?: number;
	value?: string;
	options: string[];
	closeAfterSelection?: boolean;
	onChange?: (value: string) => void; 
	onSelect?: (value: string) => void;
};

export default function InputDropdown({label, icon, defaultIndex = 0, value, closeAfterSelection = true, options, onChange, onSelect}: InputDropdownProps){
	const [expanded, setExpanded] = useState(false);
	const [selected, setSelected] = useState<string>("");
	const dropdownRef = useRef<HTMLDivElement>(null);

	const selectionHandler = (opt: string) => {
		setSelected(opt);
		onSelect ? onSelect(opt) : undefined
		onChange ? onChange(opt) : undefined;

		if (closeAfterSelection){
			setExpanded(false);
		}
	};

	useEffect(() => {
		const clickoutHandler = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)){
				setExpanded(false);
			}
		}

		if (defaultIndex != -1){
			selectionHandler(selected);
		}
		value ? selectionHandler(value) : undefined;

		value && setSelected(value);

		document.addEventListener("mousedown", clickoutHandler);

		return () => {
			document.removeEventListener("mousedown", clickoutHandler);
		};
	}, []);

	return (
		<div className="dropdown-layout" ref={dropdownRef}>
			<Field label={label} icon={icon}>
				<div className="dropdown-style" onClick={() => setExpanded(!expanded)}>
					<input value={value} type="text" onChange={onChange ? (e) => onChange(e.target.value) : undefined}/>
				
					{expanded ? 
						<IconButton icon={<IoIosArrowDown/>}/>
					:
						<IconButton icon={<IoIosArrowUp/>}/>
					}

				</div>
			</Field>

			{expanded && 
				<Field className="dropdown-content-layout">
					{options.map((opt, index) => {
						if (opt == selected){
							return (
								<div key={index} className="dropdown-option-style selected" onClick={() => selectionHandler(opt)}>
									<span>{opt}</span>
									<FaCheck/>
								</div>
							);
						} else {
							return (
								<div key={index} className="dropdown-option-style" onClick={() => selectionHandler(opt)}>
									<span>{opt}</span>
								</div>
							);
						};
					})}
				</Field>
			}
		</div>
	)
}