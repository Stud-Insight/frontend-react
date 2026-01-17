import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import InputField from "../../components/input/InputField.tsx";
import SubmitButton from "../../components/input/SubmitButton.tsx";
import LinkButton from "../../components/nav/LinkButton.tsx";
import InfoBox from "../../components/ui/InfoBox.tsx";
import LoginPage from "./LoginPage.tsx";
import { useAuth } from "../../context/AuthContext.tsx";

import "./LoginPage.css";

export default function AccountLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const login_handle = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Submitting form");

        try {
            await login(email, password);
            console.log("Login resolved");
            navigate("/dashboard/home");
        } catch (err) {
            console.log("Login failed", err);
            setError("Erreur de connexion");
        }
    };

    return (
        <LoginPage>
            <form className="content-style-div" onSubmit={login_handle}>
                {error ? <InfoBox label={error} type="error"/> : undefined}
                <InputField
                    label="E-Mail"
                    value={email}
                    onChange={setEmail}
                    icon={<IoMail />}
                    disabled={isSubmitting}
                />
                <InputField
                    label="Mot de passe"
                    value={password}
                    onChange={setPassword}
                    icon={<FaLock />}
                    is_password={true}
                    offset={-1.8}
                    disabled={isSubmitting}
                />
                <LinkButton
                    label="Mot de passe oublie ?"
                    redirection="/auth/recovery"
                    push_right={true}
                />
                <SubmitButton
                    label={isSubmitting ? "Connexion..." : "Se connecter"}
                    type="submit"
                    disabled={isSubmitting}
                />
            </form>
        </LoginPage>
    );
}
