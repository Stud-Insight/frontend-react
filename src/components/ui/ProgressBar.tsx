import React from "react"
import ContainerWidget from "./ContainerWidget";
import Tag from "../../atoms/ui/Tag";
import "./ProgressBar.css";

interface ProgressBarProps {
    label?: string;
    current: number;
	tag?: string;
    subtext?: string;
}

export default function ProgressBar({label, current, tag, subtext}: ProgressBarProps){
    return ( 
		<ContainerWidget>
			 <div className="progress-info">
                <label className="progress-label">{label}</label>
				<Tag label={tag} color="var(--gray1-col)"/>
            </div>

            <div className="progress-bar-bg">
                <div className="progress-bar-fill" style= {{ width: `${current * 100}%`}}/>
            </div>

            {subtext && <label className="progress-subtext">{subtext}</label>}
		</ContainerWidget>
    );
}