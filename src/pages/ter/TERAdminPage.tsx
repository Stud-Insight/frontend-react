import React, {useState, useEffect, ReactNode}from "react";
import DashboardPage from "../dashboard/DashboardPage";
import InfoWidget from "../../components/ui/InfoWidget";
import GroupProjectWidget from "../../components/objects/GroupProjectWidget";
import SubmitButton from "../../components/input/SubmitButton";
import NavigationButton from "../../components/nav/NavigationButton";
import InfoBox from "../../components/ui/InfoBox";
import ContainerWidget from "../../components/ui/ContainerWidget";
import UserSelectionDialog from "../../components/input/UserSelectionDialog";

import { TbSchool } from "react-icons/tb";
import { FaRegFile } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import TERService, { TERPeriod  } from "../../services/TERService";

import { useParams } from "react-router-dom";
import "../dashboard/UsersPage.css"
import "../dashboard/DashboardPage.css"
import "./TERAdminPage.css"

function GroupesView() {
  	return <div>Liste des groupes</div>;
}

function EncadrantsView() {
  	return <div>Liste des encadrants</div>;
}

function ProjetsView() {
  	return <div>Liste des projets</div>;
}

function ModaliteView() {
  	return <div>Modalités du TER</div>;
}

export default function TERAdminPage(){
	const { id } = useParams<{ id: string }>();
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [selectedTER, setSelectedTER] = useState<TERPeriod | null>();
	const [currentPage, setCurrentPage] = useState<string>("etu");
	const [addingUser, setAddingUser] = useState<boolean>(false);

	const addStudentHandle = async (selectedUsers: Set<string>) => {
		try {
			console.log(selectedUsers);
			setAddingUser(false);
			setSuccess("Nice!")
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};
	
	const studentView = () => {
		return <>
			<div className="dashboard-top-layout">
				<div></div>
				<SubmitButton icon={<FaPlus/>} label="Ajoute Etudiant" onChange={() => setAddingUser(true)}/>
			</div>
				
			<table className="users-table-style">
				<thead>
					<tr>
						<th>Profile</th>
						<th>Nom</th>
						<th>E-Mail</th>
						<th>Groupe</th>
						<th>Rôle</th>
						<th></th>
					</tr>
				</thead>
				
			</table>
		</>
	}

	const viewMap: Map<string, ReactNode> = new Map([
		["etu", studentView()],
		["grp", <GroupesView/>],
		["enca", <EncadrantsView/>],
		["proj", <ProjetsView/>],
		["modal", <ModaliteView/>]
	]);

	useEffect(() => {
		const getTer = async () => {
			try {
				const data = await TERService.getPeriod(id);
				setSelectedTER(data);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		getTer();
	}, []);

	return (
		<DashboardPage>
			{addingUser && 
				<UserSelectionDialog onClose={() => setAddingUser(false)} onConfirm={(users) => addStudentHandle(users)}/>
			}

			<div className="dashboard-top-layout">
				<label style={{fontWeight: 800, fontSize: "25px"}}>{selectedTER?.name}</label>
			</div>

			<label style={{color: "var(--gray1-col)"}}>Vue d'ensemble des groupes, projets et participants.</label>

			{success && <InfoBox label={success} type="success"/> }
			{error && <InfoBox label={error} type="error"/>}
	
			<ContainerWidget>
				<div className="ter-admin-button-nav-layout">
					<NavigationButton label="Etudiants" active={currentPage == "etu"} showBackground={true} icon={<FiUser/>} onClick={() => setCurrentPage("etu")}/>
					<NavigationButton label="Groupes" active={currentPage == "grp"} showBackground={true} icon={<FiUsers/>} onClick={() => setCurrentPage("grp")}/>
					<NavigationButton label="Encadrants" active={currentPage == "enca"} showBackground={true} icon={<TbSchool/>} onClick={() => setCurrentPage("enca")}/>
					<NavigationButton label="Projets" active={currentPage == "proj"} showBackground={true} icon={<FaRegFile/>} onClick={() => setCurrentPage("proj")}/>
					<NavigationButton label="Modalité" active={currentPage == "modal"} showBackground={true} icon={<TbSchool/>} onClick={() => setCurrentPage("modal")}/>
				</div>
			</ContainerWidget>

			{viewMap.get(currentPage)}
		</DashboardPage>
	)
}