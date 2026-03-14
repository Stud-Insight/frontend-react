import React from "react";
import DashboardPage from "./DashboardPage";
import HelpContainerWidget from "../../components/ui/HelpContainerWidget";

import { FiArchive } from "react-icons/fi";
import { AiOutlineAppstore } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FaRegFolder } from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";
import { TbSchool } from "react-icons/tb";
import { MdWorkOutline } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";

import "./HelpPage.css";

export default function HelpPage(){
	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Besoin d'aide?</span>
				</div>
			</div>
			<span style={{color: "var(--gray1-col)"}}>Trouvez toutes les réponses aux questions fréquentes pour apprendre à utiliser la plateforme.</span>

			<div className="help-page-widget-layout">
				<HelpContainerWidget icon={<TbSchool/>} color="var(--blue-col)" title="TER" 
					desc="Accédez à votre espace TER : gestion des groupes, choix des sujets et suivi de l’avancement du projet."
				/>
				<HelpContainerWidget icon={<MdWorkOutline/>} color="var(--blue-col)" title="Stages" 
					desc="Consultez et gérez les offres de stage, suivez vos candidatures et accédez aux informations liées à votre stage."
				/>
				<HelpContainerWidget icon={<LuMessageSquare/>} color="var(--blue-col)" title="Conversations" 
					desc="Échangez avec les autres utilisateurs via le système de messagerie intégré."
				/>
				<HelpContainerWidget icon={<FaRegBell/>} color="var(--blue-col)" title="Notifications" 
					desc="Recevez des alertes importantes concernant vos invitations, messages, projets et autres activités."
				/>
				<HelpContainerWidget icon={<TbSchool/>} color="var(--blue-col)" title="Sujet TER" 
					desc="Parcourez les sujets de TER proposés par les enseignants et ajoutez-les à vos favoris pour votre groupe."
				/>
				<HelpContainerWidget icon={<FiArchive/>} color="var(--blue-col)" title="Gestion TER" 
					desc="Espace réservé aux enseignants pour gérer les périodes TER, les groupes, les sujets et le déroulement du projet."
				/>
				<HelpContainerWidget icon={<FiUsers/>} color="var(--blue-col)" title="Gestion Utilisateurs" 
					desc="Administration des comptes utilisateurs : création, modification des rôles et gestion des accès."
				/>
				<HelpContainerWidget icon={<FiArchive/>} color="var(--blue-col)" title="Archives" 
					desc="Consultez les anciens TER, sujets, groupes et projets archivés des années précédentes."
				/>
				<HelpContainerWidget icon={<FiUser/>} color="var(--blue-col)" title="Profile" 
					desc="Gérez vos informations personnelles, votre email, votre mot de passe et vos préférences de compte."
				/>
			</div>
		</DashboardPage>
	)
}