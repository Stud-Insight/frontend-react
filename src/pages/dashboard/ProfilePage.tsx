import React, { useState, useRef } from "react";
import DashboardPage from "./DashboardPage";
import ContainerWidget from "../../components/ui/ContainerWidget";
import UserAvatar from "../../components/ui/UserAvatar";
import InputField from "../../components/input/InputField";
import Button from "../../atoms/input/Button";
import InfoBox from "../../components/ui/InfoBox";
import { useAuth } from "../../hooks/AuthContext";
import AuthService from "../../services/AuthService";

import { FiUser, FiLock, FiUpload, FiTrash2 } from "react-icons/fi";

import "./ProfilePage.css";

export default function ProfilPage() {
	const { user, refreshUser } = useAuth();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);

	const [currentPassword, setCurrentPassword] = useState<string>("");
	const [newPassword, setNewPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [savingPassword, setSavingPassword] = useState<boolean>(false);

	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const flashSuccess = (msg: string) => {
		setSuccess(msg);
		setTimeout(() => setSuccess(null), 5000);
	};

	const flashError = (msg: string) => {
		setError(msg);
		setTimeout(() => setError(null), 5000);
	};

	const avatarChangeHandle = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploadingAvatar(true);
		try {
			await AuthService.uploadAvatar(file);
			if (refreshUser) await refreshUser();
			flashSuccess("Avatar mis à jour.");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			flashError(message);
		} finally {
			setUploadingAvatar(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	const avatarDeleteHandle = async () => {
		setUploadingAvatar(true);
		try {
			await AuthService.deleteAvatar();
			if (refreshUser) await refreshUser();
			flashSuccess("Avatar supprimé.");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			flashError(message);
		} finally {
			setUploadingAvatar(false);
		}
	};

	const changePasswordHandle = async () => {
		if (!currentPassword || !newPassword || !confirmPassword) {
			flashError("Tous les champs de mot de passe sont requis.");
			return;
		}
		if (newPassword !== confirmPassword) {
			flashError("Les deux mots de passe ne correspondent pas.");
			return;
		}
		if (newPassword.length < 8) {
			flashError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
			return;
		}

		setSavingPassword(true);
		try {
			await AuthService.changePassword(currentPassword, newPassword);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			flashSuccess("Mot de passe modifié.");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			flashError(message);
		} finally {
			setSavingPassword(false);
		}
	};

	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{ fontWeight: "var(--big-bold)", fontSize: "25px" }}>Profil</span>
				</div>
			</div>

			<span style={{ color: "var(--gray1-col)" }}>Consultez votre profil, gérez votre avatar et votre mot de passe.</span>

			{error && <InfoBox label={error} type="error" />}
			{success && <InfoBox label={success} type="success" />}

			<div className="profile-page-layout">
				<ContainerWidget icon={<FiUser />} label="Avatar" className="profile-page-left-layout">
					<div className="profile-page-avatar">
						<UserAvatar user={user} size={250} />
						<input
							ref={fileInputRef}
							type="file"
							accept="image/png,image/jpeg,image/webp,image/gif"
							style={{ display: "none" }}
							onChange={avatarChangeHandle}
						/>
						<Button
							icon={<FiUpload />}
							label={uploadingAvatar ? "En cours..." : "Changer l'avatar"}
							onClick={() => fileInputRef.current?.click()}
						/>
						{user?.avatar && (
							<Button
								icon={<FiTrash2 />}
								label="Supprimer"
								style="danger"
								onClick={avatarDeleteHandle}
							/>
						)}
					</div>
				</ContainerWidget>

				<div className="profile-page-right-layout">
					<ContainerWidget icon={<FiUser />} label="Informations" className="profile-info-avatar">
						<InputField label="ID" value={`#${user?.id ?? ""}`} />
						<InputField label="E-Mail" value={user?.email ?? ""} />
						<InputField label="Prénom" value={user?.first_name ?? ""} />
						<InputField label="Nom" value={user?.last_name ?? ""} />
						<span style={{ color: "var(--gray1-col)", fontSize: "12px", padding: "0 10px" }}>
							Pour modifier votre nom ou votre email, contactez un administrateur.
						</span>
					</ContainerWidget>

					<ContainerWidget icon={<FiLock />} label="Changer le mot de passe" className="profile-info-avatar">
						<InputField
							label="Mot de passe actuel"
							type="password"
							value={currentPassword}
							onChange={setCurrentPassword}
						/>
						<InputField
							label="Nouveau mot de passe"
							type="password"
							value={newPassword}
							onChange={setNewPassword}
						/>
						<InputField
							label="Confirmer le nouveau mot de passe"
							type="password"
							value={confirmPassword}
							onChange={setConfirmPassword}
						/>
						<Button
							label={savingPassword ? "Enregistrement..." : "Modifier le mot de passe"}
							onClick={changePasswordHandle}
						/>
					</ContainerWidget>
				</div>
			</div>
		</DashboardPage>
	);
}
