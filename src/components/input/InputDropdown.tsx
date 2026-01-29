import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

import "./InputDropdown.css"

interface InputDropdownProps {
	label?: string;
	default_index?: number;
	value?: string;
	options: string[];
	close_after_selection?: boolean;
	onChange?: (value: string) => void; 
};

export default function InputDropdown({label, default_index = 0, value, close_after_selection = true, options, onChange}: InputDropdownProps){
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<string>(options[default_index]);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const openHandler = () => {
		setOpen(!open);
	};

	const selectionHandler = (opt: string) => {
		setSelected(opt);
		onChange ? onChange(opt) : undefined;

		if (close_after_selection){
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
		<div className="dropdown-main-super-layout">
			{label ? <label className="dropdown-label">{label}</label> : undefined}

			<div className="dropdown-layout-style" ref={dropdownRef}>
				<div className={open ? "dropdown-main-style active" : "dropdown-main-style"} onClick={openHandler}>
					<span>{selected}</span>
					{open ? <IoIosArrowDown/> : <IoIosArrowUp/>}
				</div>

				{open && 
					<div className="dropdown-content-options">
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
		</div>
	)
}