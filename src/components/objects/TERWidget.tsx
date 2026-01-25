import React from "react";
import TERService, { TER } from "../../services/TERService";
import ContainerWidget from "../ui/ContainerWidget";
import TagWidget from "../ui/TagWidget";

import { TbSchool } from "react-icons/tb";

import "./TERWidget.css"

interface TERWidgetInteface {
	data: TER;
}

export default function TERWidget({data}: TERWidgetInteface){
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

				<label style={{fontWeight: "var(--big-bold)", fontSize: 20}}>{data.title}</label>
				<TagWidget label="Active" color="var(--green-col)"/>
			</div>
			
			<div className="ter-widget-date-layout">
				<label>{dateFormat(data.startDate)}</label>
				<label>-</label>
				<label>{dateFormat(data.endDate)}</label>
			</div>

		</ContainerWidget>
	);
}	