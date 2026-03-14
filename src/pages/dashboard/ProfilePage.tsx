import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage";
import ContainerWidget from "../../components/ui/ContainerWidget";
import UserAvatar from "../../components/ui/UserAvatar";
import IconButton from "../../components/button/IconButton";
import { useAuth } from "../../hooks/AuthContext";

import { MdOutlineEdit } from "react-icons/md";
import InputAttachment from "../../components/input/InputAttachment"
import { FiUser } from "react-icons/fi";
import InputField from "../../components/input/InputField";

import "./ProfilePage.css";

export default function ProfilePage(){
	const { user } = useAuth();
	const [nom, setNom] = useState<string | undefined>("");
	const [prenom, setPrenom] = useState<string | undefined>("");
	const [mail, setMail] = useState<string | undefined>("");
	const [mdp, setMdp] = useState<string | undefined>("");

	const updateAvatarHandle = () => {


	};

	const updateDetailsHandle = () => {

	};

	const requestPasswordChange = () => {

	};

	const resetFields = () => {
		setNom(user?.last_name);
		setPrenom(user?.first_name);
		setMail(user?.email);
	}

	useEffect(() => {
		resetFields();
	}, []);
	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Profile</span>
				</div>
			</div>

			<span style={{color: "var(--gray1-col)"}}>Gérez et modifier votre profile.</span>

			<div className="profile-page-layout">
				<ContainerWidget icon={<FiUser/>} label="Avatar" className="profile-page-left-layout">
					<div className="profile-page-avatar">
						<UserAvatar user={user} size={250}/>
						<InputAttachment accept=".png"/>
					</div>
				</ContainerWidget>

				<div className="profile-page-right-layout">
					<ContainerWidget icon={<FiUser/>} label="Info" className="profile-info-avatar">
						<InputField label="ID" value={`#${user?.id}`}/>
						<InputField label="Nom" value={nom}/>
						<InputField label="Prenom" value={prenom}/>
						<InputField label="E-Mail" value={mail}/>
					</ContainerWidget>

					<ContainerWidget icon={<FiUser/>} label="About me" className="profile-info-avatar">
						<span>jsp un about me ici?</span>
					</ContainerWidget>
				</div>
			</div>

		</DashboardPage>
	)
}