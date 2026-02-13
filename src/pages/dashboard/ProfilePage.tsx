import React from "react";
import DashboardPage from "./DashboardPage";
import ContainerWidget from "../../components/ui/ContainerWidget";
import UserAvatar from "../../components/ui/UserAvatar";
import IconButton from "../../components/button/IconButton";
import { useAuth } from "../../context/AuthContext";

import { MdOutlineEdit } from "react-icons/md";
import InputAttachment from "../../components/input/InputAttachment"
import { FiUser } from "react-icons/fi";

import "./ProfilePage.css";

export default function ProfilePage(){
	const {user} = useAuth();

	const updateAvatarHandle = () => {

	};

	const updateDetailsHandle = () => {

	};

	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Profile</span>
				</div>
			</div>

			<span style={{color: "var(--gray1-col)"}}>Créez et gérez vos propositions de sujet TER.</span>

			<div className="profile-page-wrapper">
				<div className="profile-page-layout">
					<ContainerWidget icon={<FiUser/>} label="Avatar" className="profile-page-avatar">
						<UserAvatar user={user} size={250}/>
						<InputAttachment accept=".png"/>
					</ContainerWidget>

					<ContainerWidget icon={<FiUser/>} label="Info" className="profile-info-avatar">
						<span>{user?.first_name}</span>
						<span>{user?.last_name}</span>
						<span>{user?.email}</span>
						<span>{user?.email}</span>
						<span>{user?.email}</span>
					</ContainerWidget>
				</div>

				<ContainerWidget icon={<FiUser/>} label="About me" className="profile-info-avatar">
			
				</ContainerWidget>
			</div>
		
		</DashboardPage>
	)
}