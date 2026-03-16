import React, {useState, useEffect} from "react";
import InfoWidget from "../../../components/ui/InfoWidget";
import GroupService, { Group } from "../../../services/GroupService";
import TERService, { TERPeriod } from "../../../services/TERService";
import SubjectService, { Subject, SubjectRank } from "../../../services/SubjectService";
import SubjectWidget from "../../../components/objects/SubjectWidget";

import { FaRegFile} from "react-icons/fa";

import "./TERSubjectView.css"

interface TERSubjectViewProps {
	period : TERPeriod;
	setError: (error: string) => void;
	setSuccess: (success: string) => void;
};

export default function TERSubjectView({period, setError, setSuccess}: TERSubjectViewProps){
	const [page, setPage] = useState<number>(0);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [myGroup, setMyGroup] = useState<Group | null>(null);
	const [ranks, setRanks] = useState<SubjectRank[]>([]);

	const getRankings = async () => {
		try {
			const res = await SubjectService.getMemberSubjectRanking(myGroup.id);
			setRanks(res);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

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

		const getMyGroup = async () => {
			try {
				const res = await GroupService.getMyGroup(period.id);
				setMyGroup(res);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		getMyGroup();
		getSubjects();
	}, []);

	useEffect(() => {
		if (myGroup) {
			getRankings();
		}
	}, [myGroup])
	return (
		<>
			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Classement" icon={<FaRegFile/>} info={0} color="var(--blue-col)" active={page == 1} onClick={() => setPage(1)}/>
				<InfoWidget label="Sujets" icon={<FaRegFile/>} info={subjects.length} color="var(--blue-col)" active={page == 2} onClick={() => setPage(2)}/>
			</div>

			{page == 2 && subjects && subjects.map(subject => (
				<SubjectWidget subject={subject} adminMode={false} privateMode={false}/>
			))}
		</>
	)
}