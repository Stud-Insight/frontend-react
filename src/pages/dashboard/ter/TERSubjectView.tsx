import React, {useState, useEffect} from "react";
import InfoWidget from "../../../components/ui/InfoWidget";
import DashboardPage from "../DashboardPage";
import TERService, { TERPeriod } from "../../../services/TERService";
import { Subject, SubjectStatus } from "../../../services/SubjectService";
import SubjectWidget from "../../../components/objects/SubjectWidget";
import InfoBox from "../../../components/ui/InfoBox";
import TERWidgetInfo from "../../../components/objects/TERWidgetInfo";

import { FaRegFile} from "react-icons/fa";
import { useParams } from "react-router-dom";

import "./TERSubjectView.css"

interface TERSubjectViewProps {
	period : TERPeriod;
	setError: (error: string) => void;
	setSuccess: (success: string) => void;
};

export default function TERSubjectView({period, setError, setSuccess}: TERSubjectViewProps){
	const [page, setPage] = useState<number>(0);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	
	useEffect(() => {
		const getSubjects = async () => {
			try {
				const data = await TERService.getSubjects(period.id);
				setSubjects(data);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}
		
		getSubjects();
	}, []);

	return (
		<>
			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Classement" icon={<FaRegFile/>} info={subjects.length} color="var(--blue-col)" active={page == 1} onClick={() => setPage(1)}/>
				<InfoWidget label="Sujets" icon={<FaRegFile/>} info={subjects.length} color="var(--blue-col)" active={page == 2} onClick={() => setPage(2)}/>
			</div>

			{page == 2 && subjects && subjects.map(subject => (
				<SubjectWidget subject={subject} adminMode={false} privateMode={false}/>
			))}
		</>
	)
}