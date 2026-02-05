import React, {useState, ReactNode, useRef ,useEffect} from "react";
import IconButton from "../button/IconButton";
import { FaEllipsis } from "react-icons/fa6";
import ContainerWidget from "../ui/ContainerWidget.tsx";

import "./OverflowMenu.css";

interface MenuOptionProps {
	label: string;
	icon: ReactNode;
	onClick?: () => void;
};

interface OverflowMenuProps {
	options: MenuOptionProps[];
	onClick?: () => void;
};

export default function OverflowMenu({options, onClick}: OverflowMenuProps){
	const [expanded, setExpanded] = useState<boolean>(false);
	const menuRef = useRef<HTMLDivElement | null>(null);
	
	const clickHandle = (func?: () => void) => {
		func?.();
		setExpanded(false);
	};

	useEffect(() => {
		const clickoutHandler = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)){
				setExpanded(false);
			}
		};

		document.addEventListener("mousedown", clickoutHandler);

		return () => {
			document.removeEventListener("mousedown", clickoutHandler);
		}
	}, []);
	return (
		<div className="expanded-overflow-menu-layout">
			<IconButton icon={<FaEllipsis/>} onClick={() => {
				setExpanded(!expanded)
				onClick ? onClick() : undefined;
			}} size={20}/>

			<div ref={menuRef}>
				<ContainerWidget className={`expanded-overflow-menu ${expanded ? "expanded" : undefined}`}>
					<div style={{gap: "0px;"}}>
						{options.map((option) => (
							<div className="overflow-menu-option" onClick={() => clickHandle(option.onClick)}>
								{option.icon}
								<label>{option.label}</label>
							</div>
						))}
					</div>
				</ContainerWidget>
			</div>
		</div>
	)
}