import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import InputField from "../../components/input/InputField.tsx";
import Button from "../../atoms/input/Button.tsx";
import LinkButton from "../../components/button/LinkButton.tsx";
import InfoBox from "../../components/ui/InfoBox.tsx";
import LoginPage from "./LoginPage.tsx";
import UserService from "../../services/UserService.ts";
import { useAuth } from "../../hooks/AuthContext.tsx";

export default function AccountLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const loginHandle = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate("/dashboard/home");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur de connexion";
            setError(message);
            setIsSubmitting(false);
        }
    };

    return (
        <LoginPage>
            <form method="POST" className="content-style-div" onSubmit={loginHandle}>
                {error ? <InfoBox label={error} type="error"/> : undefined}
                <InputField label="E-Mail" value={email} onChange={setEmail} type="email" icon={<IoMail/>}/>
                <InputField label="Mot de passe" value={password} onChange={setPassword} type="password" icon={<FaLock/>}/>

				<div className="login-page-link right">
					<LinkButton label="Mot de passe oublié ?" redirection="/auth/recovery"/>
				</div>
                
				<Button label={isSubmitting ? "Connexion..." : "Se connecter"} width="100%" height={30}/>
            </form>
        </LoginPage>
    );
}
