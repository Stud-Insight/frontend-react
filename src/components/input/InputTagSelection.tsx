import React, { useEffect, useState, ReactNode }from "react";
import InputField from "./InputField";
import Tag from "../../atoms/ui/Tag";
import Field from "../../atoms/input/Field";

import "./InputTagSelection.css"

interface InputTagSelectionProps {
	label?: string;
	icon?: ReactNode;
	options: string[];
	tags: Set<string>;
	onSelect?: (tag: string) => void;
	onDelete?: (tag: string) => void;
};

export default function InputTagSelection({label, icon, options, tags, onDelete, onSelect}: InputTagSelectionProps){
	const [input, setInput] = useState("");
	const [filteredTags, setFilteredTags] = useState<Set<string>>(new Set());

	const filterTags = (s: string) => {
		let newTags: Set<string> = new Set();

		{Array.from(options).map((tag, index) => {
			let g = tag.toUpperCase();

			if (g.includes(s.toUpperCase())){
				newTags.add(tag);
			}
		})}

		return newTags;
	}

	const tagSelectionHandle = (tag: string) => {
		onSelect ? onSelect(tag) : undefined;
		setInput("");
		setFilteredTags(new Set());
	};

	const inputHandle = (s: string) => {
		setInput(s);
		if (s != ""){
			setFilteredTags(filterTags(s));
		} else {
			setFilteredTags(new Set());
		}
	}
	
	return (
		<div className="tag-selection-layout">
			<Field label={label} icon={icon} className="tag-selection-container">
				{Array.from(tags).map((tag, index) => (
					<Tag key={tag} label={tag} onDelete={onDelete ? () => onDelete(tag) : undefined}/>
				))}

				<input value={input} onChange={(e) => inputHandle(e.target.value)}/>
			</Field>

			{filteredTags.size > 0 && 
				<Field className="tag-selection-container">
					{Array.from(filteredTags).map((tag, index) => (
						<Tag key={tag} label={tag} onSelect={() => tagSelectionHandle(tag)}/>
					))}
				</Field>
			}
		</div>
	)
}