import React, { useState } from "react";
import DashboardPage from "./DashboardPage.tsx";
import { useAuth } from "../../context/AuthContext.tsx";
import InputField from "../../components/input/InputField.tsx"
import SubmitButton from "../../components/input/SubmitButton.tsx"
import UserAvatar from "../../components/ui/UserAvatar.tsx";
import InputDropdown from "../../components/input/InputDropdown.tsx";

import "./ProfilePage.css"

export default function ProfilePage(){
    const { user } = useAuth();
	const [firstName, setFirstName] = useState(user?.first_name);
	const [lastName, setLastName] = useState(user?.last_name);
	const [email, setEmail] = useState(user?.email);
	const [password, setPassword] = useState("mdp");
	const [telephone, setTelephone] = useState("+331122334455");
	const [aboutMe, setAboutMe] = useState("Salut me");
    return (
        <DashboardPage>
			<label> Profile </label>

			<div className="main-profile-container">
				<div className="sub-profile-container">
					<div className="profile-image-container">
						<div className="profile-avatar-container">
							<UserAvatar user={user}/>
						</div>
						<label>{user?.first_name} {user?.last_name}</label>
					</div>

					<div className="profile-container">
						<InputField label={"Prenom"} value={firstName}/>
						<InputField label={"Nom"} value={lastName}/>
						<InputField label={"E-Mail"} value={email}/>
						<InputField label={"Mot de passe"} value={password}/>
						<InputField label={"Téléphone"} value={telephone}/>
						<SubmitButton label={"Enregistrer"}/>
					</div>
				</div>

				<div className="profile-container">
					<InputField label={"About Me"} value={aboutMe}/>
					<InputDropdown label={"Rôle"} options={["User", "Extern", "Prof", "Admin"]}/>
				</div>
			</div>
        </DashboardPage>
    );
}