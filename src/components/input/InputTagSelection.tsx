import React, { useEffect, useState, ReactNode, useRef }from "react";
import InputField from "./InputField";
import Tag from "../../atoms/ui/Tag";
import Field from "../../atoms/input/Field";

import "./InputTagSelection.css"

interface InputTagSelectionProps {
	label?: string;
	icon?: ReactNode;
	options?: Set<string>;
	tags: Set<string>;
	alwaysShow?: boolean;
	onSelect?: (tag: string) => void;
	onDelete?: (tag: string) => void;
};

export default function InputTagSelection({label, icon, options, tags, alwaysShow = false, onDelete, onSelect}: InputTagSelectionProps){
	const [input, setInput] = useState("");
	const [filteredTags, setFilteredTags] = useState<Set<string>>(new Set());
	const inputRef = useRef<HTMLInputElement | null>(null);

	const pressHandle = () => {
		inputRef.current?.focus();
	};

	const filterTags = (s: string) => {
		let newTags: Set<string> = new Set();

		Array.from(options).map((tag, index) => {
			let g = tag.toUpperCase();

			if (g.includes(s.toUpperCase()) && !tags.has(tag)){
				newTags.add(tag);
			}
		});
		
		return newTags;
	}

	const tagSelectionHandle = (tag: string) => {
		onSelect ? onSelect(tag) : undefined;
		setFilteredTags(filterTags(""));
	};

	const inputHandle = (s: string) => {
		setInput(s);
		setFilteredTags(filterTags(s));
	}

	useEffect(() => {
		inputHandle("");
	}, []);
	
	return (
		<div className="tag-selection-layout">
			<Field label={label} icon={icon} className="tag-selection-container" onClick={pressHandle}>
				{Array.from(tags).map((tag, index) => (
					<Tag key={tag} label={tag} onDelete={onDelete ? () => onDelete(tag) : undefined}/>
				))}

				<input ref={inputRef} value={input} onChange={(e) => inputHandle(e.target.value)}/>
			</Field>

			{filteredTags.size > 0 && 
				<Field className="tag-selection-container">
					{Array.from(filteredTags).map((tag, index) => (
						<Tag key={tag} label={tag} onSelect={() => tagSelectionHandle(tag)} color="var(--gray1-col)"/>
					))}
				</Field>
			}
		</div>
	)
}