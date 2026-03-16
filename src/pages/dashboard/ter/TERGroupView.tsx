import React, {useState, useEffect} from "react";
import InfoWidget from "../../../components/ui/InfoWidget";
import TERService, { TERPeriod } from "../../../services/TERService";
import { User } from "../../../services/UserService";
import GroupProjectWidget from "../../../components/objects/GroupProjectWidget";
import GroupService, { Group, GroupInvitation, InvitationStatus } from "../../../services/GroupService";
import Button from "../../../atoms/input/Button";
import ModalDialog from "../../../components/dialog/ModalDialog";
import InputField from "../../../components/input/InputField";
import UserSelectionDialog from "../../../components/dialog/UserSelectionDialog";
import UserWidget from "../../../components/objects/UserWidget";
import GroupInvitationWidget from "../../../components/objects/GroupInvitationWidget";
import ContainerWidget from "../../../components/ui/ContainerWidget";
import ConfirmationDialog from "../../../components/dialog/ConfirmationDialog";

import { LuSend } from "react-icons/lu";
import { FaRegFile} from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useAuth } from "../../../hooks/AuthContext";
import { MdOutlineEdit } from "react-icons/md";

import "./TERGroupView.css"

interface TERGroupViewProps {
	period: TERPeriod;
	setError: (error: string) => void;
	setSuccess: (success: string) => void;
};

export default function TERGroupView({period, setError, setSuccess}: TERGroupViewProps){
	const { user } = useAuth();
	const [page, setPage] = useState<number>(0);
	const [groups, setGroups] = useState<Group[]>([]);
	const [myGroup, setMyGroup] = useState<Group | null>(null);
	const [createGroup, setCreateGroup] = useState<boolean>(false);
	const [inviteGroup, setInviteGroup] = useState<boolean>(false);
	const [nomGroup, setNomGroup] = useState<string>("");
	const [enrolledStudents, setEnrolledStudents] = useState<User[]>([]);
	const [sentInvitations, setSentInvitations] = useState<GroupInvitation[]>([]);
	const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
	const [leaveGroup, setLeaveGroup] = useState<Group | null>(null);
	const [deleteGroup, setDeleteGroup] = useState<Group | null>(null);
	const [editGroup, setEditGroup] = useState<Group | null>(null);

	const deleteGroupHandle = async () => {
		setDeleteGroup(null);

		try {
			await GroupService.deleteGroup(myGroup!.id);
			setSuccess(`Vous avez supprimé le groupe '${myGroup?.name}' avec succés!`);
			setTimeout(() => setSuccess(""), 5000);
			getGroups();
			getMyGroup();
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const preEditGroup = () => {
		if (myGroup) {
			setEditGroup(myGroup);
			setNomGroup(myGroup?.name);
		}
	}

	const editGroupHandle = async () => {
		resetFields();

		try {
			await GroupService.updateGroup(myGroup?.id, nomGroup, myGroup!.max_group_size);
			getGroups();
			getMyGroup();
			setSuccess(`Groupe '${myGroup?.name}' modifié avec succés!`);
			setTimeout(() => setSuccess(""), 5000);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const leaveGroupHandle = async () => {
		setLeaveGroup(null);

		try {
			await GroupService.leaveGroup(myGroup!.id);
			getGroups();
			getMyGroup();
			setSuccess(`Vous avez quitter le groupe '${myGroup?.name}' avec succés!`);
			setTimeout(() => setSuccess(""), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	const getMyGroup = async () => {
		try {
			const res = await GroupService.getMyGroup(period.id);
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
				TERService.getStudents(period.id),
				GroupService.getMyGroup(period.id)
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
			await GroupService.sendInvitations(myGroup!.id, users);
			setSuccess(`Inviter ${users.size} étudiant${users.size > 1 ? "s" : ""} au groupe.`);
			setTimeout(() => setSuccess(""), 5000);
			getInvitedStudents(myGroup!.id);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const cancelInvitationHandle = async (invi_id: string) => {
		try {
			await GroupService.cancelInvitation(myGroup!.id, invi_id);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
		getInvitedStudents(myGroup!.id);
	}

	const getGroups = async () => {
		try {
			const res = await GroupService.getGroups(period.id);
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
			await GroupService.createGroup(period.id, nomGroup, period.max_group_size, new Set());
			setSuccess(`Groupe "${nomGroup}" à été crée dans "${period?.name}"`);
			getGroups();
			getMyGroup();
			setTimeout(() => setSuccess(""), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}

		resetFields();
	}

	useEffect(() => {
		getGroups();
		getMyGroup();
		getGroupInvitations();
	}, []);

	useEffect(() => {
		if (!myGroup?.id) {
			
			return;
		}	

		if (myGroup.leader!.id == user!.id) {
			getInvitedStudents(myGroup.id);
		}
	}, [myGroup]);

	const resetFields = () => {
		setEditGroup(null);
		setCreateGroup(false);
		setNomGroup("");
	}

	return (
		<>
			{createGroup &&
				<ModalDialog label="Creation Groupe" onClose={resetFields} className="group-view-selection-modal">
					<InputField label="Nom" value={nomGroup} onChange={setNomGroup}/>
					<Button icon={<FaPlus/>} label="Confirmer" height={30} onClick={createGroupHandle}/>
				</ModalDialog>
			}	

			{editGroup &&
				<ModalDialog label="Modifier Groupe" onClose={resetFields} className="group-view-selection-modal">
					<InputField label="Nom" value={nomGroup} onChange={setNomGroup}/>
					<Button icon={<MdOutlineEdit/>} label="Modifer" height={30} onClick={editGroupHandle}/>
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
			
			<div className="dashbord-mini-info-layout">
				{myGroup &&
					<InfoWidget label="Mon Groupe" icon={<FiUsers/>} info={`${myGroup.member_count} / ${myGroup.max_group_size}`} color="var(--blue-col)" active={page == 0} onClick={() => setPage(0)}/>
				}
				<InfoWidget label="Invitations" icon={<FiUsers/>} info={invitations.length} color="var(--blue-col)" active={page == 1} onClick={() => setPage(1)}/>
				<InfoWidget label="Groupes" icon={<FaRegFile/>} info={groups.length} color="var(--blue-col)" active={page == 3} onClick={() => setPage(3)}/>
			</div>

			{page == 0 && myGroup &&
				<>
					<div className="dashboard-top-layout">
						<div/>
						<div className="dashboard-top-button-layout">
							{user?.id == myGroup.leader!.id ? 
								<>
									<Button icon={<LuSend/>} label="Inviter" onClick={inviteStudentsToggle}/>
									<Button icon={<MdOutlineEdit/>} label="Modifier Groupe" onClick={preEditGroup}/>
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
		</>
	)
}