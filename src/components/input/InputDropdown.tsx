import React, { useState, useRef, useEffect, ReactNode } from "react";
import Field from "../../atoms/input/Field";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

import "./InputDropdown.css"

interface InputDropdownProps {
	label?: string;
	icon?: ReactNode;
	default_index?: number;
	value?: string;
	options: string[];
	closeAfterSelection?: boolean;
	onChange?: (value: string) => void; 
};

export default function InputDropdown({label, icon, default_index = 0, value, closeAfterSelection = true, options, onChange}: InputDropdownProps){
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<string>(options[default_index]);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const selectionHandler = (opt: string) => {
		setSelected(opt);
		onChange ? onChange(opt) : undefined;

		if (closeAfterSelection){
			setOpen(false);
		}
	};

	useEffect(() => {
		const clickoutHandler = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)){
				setOpen(false);
			}
		}

		selectionHandler(selected);
		value && setSelected(value);

		document.addEventListener("mousedown", clickoutHandler);

		return () => {
			document.removeEventListener("mousedown", clickoutHandler)
		};
	}, []);

	return (
		<div className="dropdown-layout" ref={dropdownRef}>
			<Field label={label} icon={icon}>
				<div className="dropdown-style" onClick={() => setOpen(!open)}>
					<input readOnly value={value} type="text" onChange={onChange ? (e) => onChange(e.target.value) : undefined}/>
					{open ? <IoIosArrowDown/> : <IoIosArrowUp/>}
				</div>
			</Field>

			{open && 
				<div className="field-content dropdown-content-layout">
					{options.map((opt, index) => {
						if (opt == selected){
							return (
								<div key={index} className="dropdown-option-style selected" onClick={() => selectionHandler(opt)}>
									<label>{opt}</label>
									<FaCheck/>
								</div>
							);
						} else {
							return (
								<div key={index} className="dropdown-option-style" onClick={() => selectionHandler(opt)}>
									<label>{opt}</label>
								</div>
							);
						};
					})}
				</div>
			}
		</div>
	)
}