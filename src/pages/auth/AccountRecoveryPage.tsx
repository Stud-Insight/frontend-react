import React, { useState } from "react";
import { IoMail } from "react-icons/io5";

import InputField from "../../components/input/InputField.tsx";
import LinkButton from "../../components/nav/LinkButton.tsx";
import SubmitButton from "../../components/input/SubmitButton.tsx";
import InfoBox from "../../components/ui/InfoBox.tsx";
import Divider from "../../components/ui/Divider.tsx";
import LoginPage from "./LoginPage.tsx";
import UserService from "../../services/UserService.ts";

import "./LoginPage.css";

export default function AccountRecoveryPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const recovery_handle = async (event: React.FormEvent) => {
        event.preventDefault();

        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        try {
            const response = await UserService.requestPasswordReset(email);
            setSuccess(response.message);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur lors de l'envoi";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <LoginPage>
            <form method="POST" className="content-style-div" onSubmit={recovery_handle}>
                <InfoBox label="Veuillez saisir votre adresse e-mail pour recevoir un lien de reinitialisation de votre mot de passe." />
                {error && <InfoBox label={error} type="error" />}
                {success && <InfoBox label={success} type="success" />}
                <InputField
                    label="E-Mail"
                    icon={<IoMail />}
                    is_password={false}
                    value={email}
                    onChange={setEmail}
                    disabled={isSubmitting}
                />
                <Divider />
                <SubmitButton
                    label={isSubmitting ? "Envoi en cours..." : "Envoyer un mail"}
                    type="submit"
                    disabled={isSubmitting}
                />
                <LinkButton
                    label="Retour a la page de connexion"
                    redirection="/auth/login"
                    push_right={true}
                    push_left={true}
                />
            </form>
        </LoginPage>
    );
}
