import React from "react"
import ContainerWidget from "./ContainerWidget";
import Tag from "../../atoms/ui/Tag";
import "./ProgressBar.css";

interface ProgressBarProps {
    current: number;
}

export default function ProgressBar({ current}: ProgressBarProps){
    return ( 
		<div className="progress-bar-bg">
			<div className="progress-bar-fill" style= {{ width: `${current * 100}%`}}/>
		</div>
    );
}