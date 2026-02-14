import React, { useState, useEffect } from "react"
import ContainerWidget from "../../../components/ui/ContainerWidget";
import ScheduleEventWidget from "../../../components/ui/ScheduleEventWidget";
import SubjectWidget from "../../../components/objects/SubjectWidget";
import { HiOutlineMenu } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { Subject, SubjectStatus } from "../../../services/SubjectService";
import { useParams } from "react-router-dom";
import TERPage from "./TERPage";

import "./TERInfoPage.css"

export default function TERInfoPage(){
	const [error, setError] = useState<string | null>();
	const [subject, setSubject] = useState<Subject | null>();
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		const getSubject = async () => {
			try {

			} catch(err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		};

		getSubject();
	}, []);

	const jours: number = 103;

	return (
		<TERPage>
			{/* <div className="dashbord-mini-info-layout">
				<InfoWidget label="Avancement" icon={<FaArrowTrendUp/>} info={`${0.5 * 100}%`} color="var(--blue-col)"/>
				<InfoWidget label="Objectifs" icon={<FaRegCheckCircle/>} info={`${1} / ${4}`} color="var(--green-col)"/>
			</div> */}

			{subject && <SubjectWidget subject={subject} privateMode={false}/> }

			<div className="ter-page-container-layout">
				<div className="ter-page-left-container">
					<ContainerWidget icon={<FiUser/>} label="Encadrant">
						{/* <UserWidget user={mock_user}/> */}
					</ContainerWidget>

					
				</div>
				
				<ContainerWidget icon={<HiOutlineMenu/>} label="Objectifs">
					<ScheduleEventWidget label="Subject Proposal Submission" date="Oct 15, 2025" completed={true}/>
					<ScheduleEventWidget label="Subject Proposal Submission" date="Oct 15, 2025" completed={false}/>
				</ContainerWidget>
			</div>

		</TERPage>
	)
}