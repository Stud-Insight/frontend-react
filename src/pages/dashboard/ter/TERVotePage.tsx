import React, {useState, useEffect} from "react";
import InfoWidget from "../../../components/ui/InfoWidget";
import DashboardPage from "../DashboardPage";
import TERService, { TERPeriod } from "../../../services/TERService";
import { Subject, SubjectStatus } from "../../../services/SubjectService";
import GroupProjectWidget from "../../../components/objects/GroupProjectWidget";
import GroupService, { Group } from "../../../services/GroupService";
import SubjectWidget from "../../../components/objects/SubjectWidget";
import ProgressBar from "../../../components/ui/ProgressBar"
import InfoBox from "../../../components/ui/InfoBox";
import Button from "../../../atoms/input/Button";
import ModalDialog from "../../../components/dialog/ModalDialog";
import InputField from "../../../components/input/InputField";
import UserWidget from "../../../components/objects/UserWidget";
import OverflowMenu from "../../../components/input/OverflowMenu";
import ContainerWidget from "../../../components/ui/ContainerWidget";
import { FaRegFile} from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { useAuth } from "../../../context/AuthContext";

import "./TERVotePage.css"

export default function TERVotePage(){
	const { id } = useParams<{ id: string }>();
	const { user } = useAuth();
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState<number>(0);
	const [period, setPeriod] = useState<TERPeriod | null>(null);
	const [groups, setGroups] = useState<Group[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [myGroup, setMyGroup] = useState<Group | null>(null);
	const [createGroup, setCreateGroup] = useState<boolean>(false);
	const [nomGroup, setNomGroup] = useState<string>("");
	const [favouriteProjects, setFavouriteProjects] = useState<Set<string>>(new Set([]));

	const favouriteHandle = () => {

	};

	const getMyGroup = async () => {
		try {
			const res = await GroupService.getMyGroup(id);
			console.log(res);
			setMyGroup(res);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const getGroups = async () => {
		try {
			const res = await GroupService.getGroups(id);
			res.sort((a, b) => (
				a.name.localeCompare(b.name)
			))

			setGroups(res);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const createGroupHandle = async () => {
		try {
			await GroupService.createGroup(id, nomGroup, 0, new Set());
			setSuccess(`Groupe "${nomGroup}" a été créé dans "${period?.name}"`);
			getGroups();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}

		resetFields();
	}

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
		getGroups();
		getMyGroup();

		console.log(myGroup);
	}, [id]);

	const resetFields = () => {
		setCreateGroup(false);
		setNomGroup("");
	}

	return (
		<DashboardPage>
			{createGroup &&
				<ModalDialog label="Creation Groupe" onClose={resetFields} className="group-view-selection-modal">
					<InputField label="Nom" value={nomGroup} onChange={setNomGroup}/>
					<Button icon={<FaPlus/>} label="Confirmer" onClick={createGroupHandle}/>
				</ModalDialog>
			}

			{period &&
				<>
					<div className="dashboard-top-layout">
						<div className="dashboard-top-title-layout">
							<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>{period.academic_year} / {period.name}</span>
						</div>
					</div>

					<ProgressBar label={`Phase: vote`} current={0.3} tag={`${3} / 20 jours`} subtext={`Deadline: `}/>
				</>			
			}

			{error && <InfoBox label={error} type="error"/>}
			{success && <InfoBox label={success} type="success"/>}
			
			<div className="dashbord-mini-info-layout">
				{myGroup &&
					<InfoWidget label="Mon Groupe" icon={<FiUsers/>} info={`${myGroup.member_count} / ${5}`} color="var(--blue-col)" active={page == 0} onClick={() => setPage(0)}/>
				}
				<InfoWidget label="Groupes" icon={<FiUsers/>} info={groups.length} color="var(--blue-col)" active={page == 1} onClick={() => setPage(1)}/>
				<InfoWidget label="Sujets" icon={<FaRegFile/>} info={subjects.length} color="var(--blue-col)" active={page == 2} onClick={() => setPage(2)}/>
			</div>

			{page == 0 && myGroup &&
				<>
					<div className="dashboard-top-layout">
						<div/>
						<div className="dashboard-top-button-layout">
							{user?.id == myGroup?.leader.id ? 
								<>
									<Button icon={<FaPlus/>} label="Modifier Groupe"/>
									<Button icon={<MdDeleteOutline/>} label="Supprimer Groupe" color="var(--red-col)"/>
								</>
								
								:
								<Button icon={<FaPlus/>} label="Quitter Groupe"/>
							}
						</div>
					</div>
					<GroupProjectWidget group={myGroup} admin={false}/>
					<ContainerWidget>
						<UserWidget user={myGroup?.leader} crown={true} showId={false}/>
						
						{myGroup.members.map(member => {
							if (member.id != myGroup.leader?.id){
								return (
									<UserWidget key={member.id} user={member} showId={false}>
										<OverflowMenu options={[
											{label: "Supprimer", icon: <MdDeleteOutline/>, onClick: () => onUserDelete?.(group.leader)},
										]}/>
									</UserWidget>
								)
							}
						})}
					</ContainerWidget>
				</>
			}
			{page == 1 &&
				<>
					{!myGroup &&
						<div className="dashboard-top-layout">
							<div/>
							<div className="dashboard-top-button-layout">
								<Button icon={<FaPlus/>} label="Créer Groupe" onClick={() => setCreateGroup(true)}/>
							</div>
						</div>
					}
					
					<div className="ter-list-group-layout">
						{groups && groups.map(group => (
							<GroupProjectWidget admin={false} key={group.id} group={group} active={group.id == myGroup?.id}/>
						))}
					</div>
				</>
			}
	
			{page == 2 && subjects && subjects.map(subject => (
				<SubjectWidget subject={subject} adminMode={false} privateMode={false}/>
			))}

		</DashboardPage>
	)
}