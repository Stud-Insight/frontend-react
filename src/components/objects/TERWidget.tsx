import React from "react";
import TERService, { TER } from "../../services/TERService";
import ContainerWidget from "../ui/ContainerWidget";
import TagWidget from "../ui/TagWidget";
import HorizontalDivider from "../ui/HorizontalDivider";
import VerticalDivider from "../ui/VerticalDivider";
import SubmitButton from "../input/SubmitButton";
import { FaArrowLeftLong } from "react-icons/fa6";
import ProgressWidget from "../ui/ProgressWidget";
import IconButton from "../input/IconButton";

import { TbSchool } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { CgExport } from "react-icons/cg";

import "./TERWidget.css"

interface TERWidgetInteface {
	data: TER;
	onClick?: () => void;
}

export default function TERWidget({data, onClick}: TERWidgetInteface){
	const dateFormat = (dateString: string) => {
		const date_t = new Date(dateString);

        return date_t.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
	}

	return (
		<ContainerWidget>
			<div className="ter-widget-title-layout">
				<div className="ter-widget-icon">
					<TbSchool/>
				</div>
				<div className="ter-widget-title-right-layout">
					<label style={{fontWeight: "var(--big-bold)", fontSize: 20}}>{data.title}</label>
					<div className="ter-widget-date-layout">
						<label>{dateFormat(data.startDate)}</label>
						<label>-</label>
						<label>{dateFormat(data.endDate)}</label>
					</div>
					<label style={{color: "var(--gray1-col)"}}>{data.code}</label>
				</div>

				<VerticalDivider/>
				<div className="ter-widget-info-layout">
					<div className="ter-widget-info-layout-container">
						<label style={{color: "var(--gray1-col)"}}>Groupes</label>
						<label style={{fontWeight: "var(--big-bold)", fontSize: 30}}>{data.groups.length}</label>
					</div>

					<div className="ter-widget-info-layout-container">
						<label style={{color: "var(--gray1-col)"}}>Projets</label>
						<label style={{fontWeight: "var(--big-bold)", fontSize: 30}}>{data.projects.length}</label>
					</div>

					<div className="ter-widget-info-layout-container">
						<label style={{color: "var(--gray1-col)"}}>Enseignants</label>
						<label style={{fontWeight: "var(--big-bold)", fontSize: 30}}>{0}</label>
					</div>
				</div>
				<VerticalDivider/>
				<div style={{fontSize: "40px"}}>
					<TagWidget label="En Cours" color="var(--green-col)"/>
				</div>
				<VerticalDivider/>
				<div>
					<SubmitButton icon={<FaArrowLeftLong/>}label={"Voir Details"} onChange={onClick}/>
				</div>
			</div>
		</ContainerWidget>
	);
}	