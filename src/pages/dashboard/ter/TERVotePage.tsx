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
	const [inviteGroup, setInviteGroup] = useState<boolean>(false);
	const [nomGroup, setNomGroup] = useState<string>("");
	const [enrolledStudents, setEnrolledStudents] = useState<User[]>([]);
	const [sentInvitations, setSentInvitations] = useState<GroupInvitation[]>([]);
	const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
	const [leaveGroup, setLeaveGroup] = useState<Group | null>(null);
	const [deleteGroup, setDeleteGroup] = useState<Group | null>(null);

	const deleteGroupHandle = async () => {
		setDeleteGroup(null);

		try {
			await GroupService.deleteGroup(myGroup.id);
			setSuccess(`Vous avez supprimé le groupe '${myGroup?.name}' avec succés!`);
			setTimeout(() => setSuccess(null), 5000);
			getGroups();
			getMyGroup();
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const leaveGroupHandle = async () => {
		setLeaveGroup(null);

		try {
			await GroupService.leaveGroup(myGroup.id);
			getGroups();
			getMyGroup();
			setSuccess(`Vous avez quitter le groupe '${myGroup?.name}' avec succés!`);
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	const getMyGroup = async () => {
		try {
			const res = await GroupService.getMyGroup(id);
			setMyGroup(res);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const getInvitedStudents = async (groupId: string) => {
		try {
			const res = await GroupService.getSentInvitations(groupId);
			const pending = res.filter(inv => inv.status == InvitationStatus.PENDING);
			setSentInvitations(pending);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const getEnrolledStudents = async () => {
		try {
			const [students, group] = await Promise.all([
				TERService.getStudents(id),
				GroupService.getMyGroup(id)
			]);

			const memberIds = new Set(group?.members.map(m => m.id));
			const filtered = students.filter(stud => !memberIds.has(stud.id));

			setEnrolledStudents(filtered);

		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	const inviteStudentsToggle = async () => {
		await getEnrolledStudents();
		setInviteGroup(true);
	}

	const getGroupInvitations = async () => {
		try {
			const res = await GroupService.getInvitations();
			const pending = res.filter(inv => inv.status == InvitationStatus.PENDING);
			setInvitations(pending);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const respondInvite = async (inv_id: string, accept: boolean) => {
		try {
			await GroupService.respondInvitation(inv_id, accept);
			getGroupInvitations();
			getGroups();
			getMyGroup();
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
 	}

	const inviteStudentsGroup = async (users: Set<User>) => {
		setInviteGroup(false);

		try {
			await GroupService.sendInvitations(myGroup?.id, users);
			setSuccess(`Inviter ${users.size} étudiant${users.size > 1 ? "s" : ""} au groupe.`);
			setTimeout(() => setSuccess(null), 5000);
			getInvitedStudents(myGroup?.id);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const cancelInvitationHandle = async (invi_id: string) => {
		try {
			await GroupService.cancelInvitation(myGroup?.id, invi_id);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
		getInvitedStudents(myGroup?.id);
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
			const res = await TERService.getPeriod(id);

			await GroupService.createGroup(id, nomGroup, res?.max_group_size, new Set());
			setSuccess(`Groupe "${nomGroup}" à été crée dans "${period?.name}"`);
			getGroups();
			getMyGroup();
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
		getGroupInvitations();
	}, [id]);

	useEffect(() => {
		if (!myGroup?.id) {
			
			return;
		}	

		if (myGroup.leader.id == user.id) {
			getInvitedStudents(myGroup.id);
		}
	}, [myGroup]);

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

			{inviteGroup &&
				<UserSelectionDialog value={enrolledStudents} label="Invitation Etudiants" button_text="Inviter" onConfirm={inviteStudentsGroup} onClose={() => setInviteGroup(false)}/>
			}

			{leaveGroup &&
				<ConfirmationDialog 
					label="Quitter Groupe?" 
					info={`Etes vous sur de vouloir quitter le groupe '${myGroup?.name}'?`}
					onCancel={() => setLeaveGroup(null)}
					onConfirm={leaveGroupHandle}
				/>
			}

			{deleteGroup &&
				<ConfirmationDialog 
					label="Supprimer Groupe?" 
					info={`Etes vous sur de vouloir supprimer votre groupe '${myGroup?.name}'?`}
					onCancel={() => setDeleteGroup(null)}
					onConfirm={deleteGroupHandle}
				/>
			}

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
				{myGroup &&
					<InfoWidget label="Mon Groupe" icon={<FiUsers/>} info={`${myGroup.member_count} / ${myGroup.max_group_size}`} color="var(--blue-col)" active={page == 0} onClick={() => setPage(0)}/>
				}
				<InfoWidget label="Invitations" icon={<FiUsers/>} info={invitations.length} color="var(--blue-col)" active={page == 1} onClick={() => setPage(1)}/>
				<InfoWidget label="Groupes" icon={<FaRegFile/>} info={groups.length} color="var(--blue-col)" active={page == 3} onClick={() => setPage(3)}/>
				<InfoWidget label="Sujets" icon={<FaRegFile/>} info={subjects.length} color="var(--blue-col)" active={page == 2} onClick={() => setPage(2)}/>
			</div>

			{page == 0 && myGroup &&
				<>
					<div className="dashboard-top-layout">
						<div/>
						<div className="dashboard-top-button-layout">
							{user?.id == myGroup?.leader.id ? 
								<>
									<Button icon={<LuSend/>} label="Inviter" onClick={inviteStudentsToggle}/>
									<Button icon={<FaPlus/>} label="Modifier Groupe"/>
									<Button icon={<MdDeleteOutline/>} label="Supprimer Groupe" color="var(--red-col)" onClick={() => setDeleteGroup(myGroup)}/>
								</>
								
								:
								<Button icon={<FaPlus/>} label="Quitter Groupe" onClick={() => setLeaveGroup(myGroup)}/>
							}
						</div>
					</div>

					<GroupProjectWidget label="Info" group={myGroup} admin={false} forceExpanded={true}/>
				
					{sentInvitations.length > 0 &&
						<ContainerWidget>
							{sentInvitations && sentInvitations.map(inv => (
								<UserWidget user={inv.invitee}>
									<Button icon={<FaPlus/>} label="Annuler Invitation" onClick={() => cancelInvitationHandle(inv.id)}/>
								</UserWidget>
							))}
						</ContainerWidget>
					}
				</>
			}

			{page == 1 &&
				<>	
					<div className="ter-list-group-layout">
						{invitations && invitations.map(inv => {
							const group = groups.find(grp => grp.id === inv.group_id);
							return <GroupInvitationWidget group={group} onAccept={() => respondInvite(inv.id, true)} onReject={() => respondInvite(inv.id, false)}/>
						})}
					</div>
				</>
			}

			{page == 2 && subjects && subjects.map(subject => (
				<SubjectWidget subject={subject} adminMode={false} privateMode={false}/>
			))}

			{page == 3 &&
				<>
					{!myGroup &&
						<div className="dashboard-top-layout">
							<div/>
							<div className="dashboard-top-button-layout">
								<Button icon={<FaPlus/>} label="Créer Groupe" onClick={() => setCreateGroup(true)}/>
							</div>
						</div>
					}	

					{myGroup ?
						<div className="ter-list-group-layout">
							{groups && groups.sort(group => {
								return (group.id == myGroup.id ? -1 : 1)
							}).map(group => (
								<GroupProjectWidget admin={false} key={group.id} group={group} active={group.id == myGroup?.id}/>
							))}
						</div>

						:

						<div className="ter-list-group-layout">
							{groups && groups.map(group => (
								<GroupProjectWidget admin={false} key={group.id} group={group} active={false}/>
							))}
						</div>
					}
				</>
			}
		</DashboardPage>
	)
}