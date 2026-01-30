import React, { ReactNode }from "react";
import InputDropdown from "./InputDropdown";
import Tag from "../../atoms/ui/Tag";
import Field from "../../atoms/input/Field";

import "./InputTagSelection.css"

interface InputTagSelectionProps {
	label?: string;
	icon?: ReactNode;
	options: string[];
	tags: Set<string>;
	onSelect?: (tag: string) => void;
	onDelete?: (tag: string) => void
};

export default function InputTagSelection({label, icon, options, tags, onDelete, onSelect}: InputTagSelectionProps){
	return (
		<div>
			<InputDropdown defaultIndex={-1} label={label} icon={icon} options={options} onChange={onSelect}/>

			{tags.size > 0 && 
				<Field className="tag-selection-container">
					{Array.from(tags).map((tag, index) => (
						<Tag key={tag} label={tag} onDelete={onDelete ? () => onDelete(tag) : undefined}/>
					))}
				</Field>
			}
		</div>
	)
}