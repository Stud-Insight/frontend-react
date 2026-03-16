import React, {useState, useEffect} from "react";
import InfoWidget from "../../../components/ui/InfoWidget";
import DashboardPage from "../DashboardPage";
import TERService, { TERPeriod } from "../../../services/TERService";
import { Subject, SubjectStatus } from "../../../services/SubjectService";
import { User } from "../../../services/UserService";
import GroupProjectWidget from "../../../components/objects/GroupProjectWidget";
import GroupService, { Group, GroupInvitation, InvitationStatus } from "../../../services/GroupService";
import SubjectWidget from "../../../components/objects/SubjectWidget";
import InfoBox from "../../../components/ui/InfoBox";
import Button from "../../../atoms/input/Button";
import ModalDialog from "../../../components/dialog/ModalDialog";
import InputField from "../../../components/input/InputField";
import TERWidgetInfo from "../../../components/objects/TERWidgetInfo";
import UserSelectionDialog from "../../../components/dialog/UserSelectionDialog";
import UserWidget from "../../../components/objects/UserWidget";
import GroupInvitationWidget from "../../../components/objects/GroupInvitationWidget";
import ContainerWidget from "../../../components/ui/ContainerWidget";
import ConfirmationDialog from "../../../components/dialog/ConfirmationDialog";

import { LuSend } from "react-icons/lu";
import { FaRegFile} from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { useAuth } from "../../../hooks/AuthContext";
import { MdOutlineEdit } from "react-icons/md";

import "./TERSubjectPage.css"

export default function TERSubjectPage(){
	const { id } = useParams<{ id: string }>();
	const { user } = useAuth();
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState<number>(0);
	const [period, setPeriod] = useState<TERPeriod | null>(null);
	const [groups, setGroups] = useState<Group[]>([]);
	const [myGroup, setMyGroup] = useState<Group | null>(null);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	
	useEffect(() => {
		const getSubjects = async () => {
			try {
				const data = await TERService.getSubjects(id);
				setSubjects(data);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		const getPeriod = async () => {
			try {
				const res = await TERService.getPeriod(id);
				setPeriod(res);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		getSubjects();
		getPeriod();
	}, [id]);

	return (
		<DashboardPage>
			{error && <InfoBox label={error} type="error"/>}
			{success && <InfoBox label={success} type="success"/>}
			
			{period &&
				<>
					<div className="dashboard-top-layout">
						<div className="dashboard-top-title-layout">
							<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>{period.academic_year} / {period.name}</span>
						</div>
					</div>

					<TERWidgetInfo period={period}/>
				</>		
			}

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Classement" icon={<FaRegFile/>} info={subjects.length} color="var(--blue-col)" active={page == 1} onClick={() => setPage(1)}/>
				<InfoWidget label="Sujets" icon={<FaRegFile/>} info={subjects.length} color="var(--blue-col)" active={page == 2} onClick={() => setPage(2)}/>
			</div>

			{page == 2 && subjects && subjects.map(subject => (
				<SubjectWidget subject={subject} adminMode={false} privateMode={false}/>
			))}
		</DashboardPage>
	)
}