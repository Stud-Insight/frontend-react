import React, { useState, useEffect } from "react";
import InfoWidget from "../../../components/ui/InfoWidget";
import GroupService, { Group } from "../../../services/GroupService";
import TERService, { TERPeriod } from "../../../services/TERService";
import SubjectService, { Subject, SubjectRank } from "../../../services/SubjectService";
import SubjectWidget from "../../../components/objects/SubjectWidget";
import InputNumberField from "../../../components/input/InputNumberField";
import Button from "../../../atoms/input/Button";
import SubjectRankWidget from "../../../components/objects/SubjectRankWidget";
import { LuSend } from "react-icons/lu";
import { FaRegFile } from "react-icons/fa";

import "./TERExecutionView.css"

interface TERExecutionViewProps {
	period: TERPeriod;
	setError: (error: string) => void;
	setSuccess: (success: string) => void;
};

export default function TERExecutionView({ period, setError, setSuccess }: TERExecutionViewProps) {
	const [page, setPage] = useState<number>(0);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [myGroup, setMyGroup] = useState<Group | null>(null);
	const [ranks, setRanks] = useState<SubjectRank[]>([]);
	const [groupRanks, setGroupRanks] = useState<SubjectRank[]>([]);
	const [myRanks, setMyRanks] = useState<Map<string, number>>(new Map());

	const updateRankHandle = (subject_id: string, rank: number) => {
		setMyRanks(prev => {
			const newMap = new Map(prev);
			newMap.set(subject_id, rank);
			return newMap;
		});
	};

	const getRankings = async () => {
		try {
			const res = await SubjectService.getMemberSubjectRanking(myGroup!.id);
			setRanks(res);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const sendRankingsHandle = async () => {
		try {
			const arr: SubjectRank[] = Array.from(myRanks.entries()).map(([subject_id, rank]) => ({
				subject_id: parseInt(subject_id),
				subject_title: "",
				rank
			})
			);
			await SubjectService.submitMemberSubjectRanking(myGroup!.id, arr);
			getRankings();
			getGroupRanks();
			setPage(1);
			setSuccess(`Vos classements ont été envoyés avec succès !`);
			setTimeout(() => setSuccess(""), 5000);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const getGroupRanks = async () => {
		try {
			const res = await SubjectService.getGroupSubjectRanking(myGroup!.id);
			setGroupRanks(res);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	useEffect(() => {
		const getSubjects = async () => {
			try {
				const data = await TERService.getSubjects(period.id);
				setSubjects(data);
			} catch (err) {
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		const getMyGroup = async () => {
			try {
				const res = await GroupService.getMyGroup(period.id);
				setMyGroup(res);
			} catch (err) {
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
			getGroupRanks();
		}

	}, [myGroup]);

	useEffect(() => {
		const map = new Map(ranks.map(rank => [rank.subject_id.toString(), rank.rank]));
		setMyRanks(map);
	}, [ranks]);

	return (
		<>
			<div className="dashbord-mini-info-layout">
				{groupRanks &&
					<InfoWidget label="Classement Groupe" icon={<FaRegFile />} info={groupRanks.length} color="var(--blue-col)" active={page == 1} onClick={() => setPage(1)} />
				}

				{subjects &&
					<InfoWidget label="Sujets" icon={<FaRegFile />} info={subjects.length} color="var(--blue-col)" active={page == 3} onClick={() => setPage(3)} />
				}
			</div>
		</>
	)
}