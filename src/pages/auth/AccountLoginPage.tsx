import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { TbSchool } from "react-icons/tb";

import InputField from "../../components/input/InputField.tsx";
import Button from "../../atoms/input/Button.tsx";
import LinkButton from "../../components/button/LinkButton.tsx";
import InfoBox from "../../components/ui/InfoBox.tsx";
import LoginPage from "./LoginPage.tsx";
import { useAuth } from "../../hooks/AuthContext.tsx";

const ENABLE_PASSWORD_AUTH = process.env.ENABLE_PASSWORD_AUTH !== "false";
const ENABLE_CAS_AUTH = process.env.ENABLE_CAS_AUTH === "true";

const CAS_ERROR_MESSAGES: Record<string, string> = {
    cas_no_ticket: "Erreur d'authentification CAS : ticket manquant.",
    cas_verification_failed: "Erreur de vérification du ticket CAS.",
    cas_invalid_ticket: "Ticket CAS invalide.",
    cas_user_creation_failed: "Impossible de créer votre compte via CAS.",
    account_disabled: "Votre compte est désactivé.",
};

export default function AccountLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login, refreshUser } = useAuth();

    useEffect(() => {
        const casSuccess = searchParams.get("cas_success");
        const casError = searchParams.get("error");

        if (casSuccess === "true") {
            refreshUser().then(() => {
                navigate("/dashboard/home", { replace: true });
            });
        }

        if (casError && CAS_ERROR_MESSAGES[casError]) {
            setError(CAS_ERROR_MESSAGES[casError]);
        }
    }, [searchParams]);

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

    const casLoginHandle = () => {
        window.location.href = `${process.env.API_URL}/auth/cas/login`;
    };

    return (
        <LoginPage>
            <form method="POST" className="content-style-div" onSubmit={loginHandle}>
                {error ? <InfoBox label={error} type="error"/> : undefined}

                {ENABLE_PASSWORD_AUTH && <>
                    <InputField label="E-Mail" value={email} onChange={setEmail} type="email" icon={<IoMail/>}/>
                    <InputField label="Mot de passe" value={password} onChange={setPassword} type="password" icon={<FaLock/>}/>

                    <div className="login-page-link right">
                        <LinkButton label="Mot de passe oublié ?" redirection="/auth/recovery"/>
                    </div>

                    <Button label={isSubmitting ? "Connexion..." : "Se connecter"} width="100%" height={30}/>
                </>}

                {ENABLE_PASSWORD_AUTH && ENABLE_CAS_AUTH &&
                    <div className="login-cas-divider">
                        <span>ou</span>
                    </div>
                }

                {ENABLE_CAS_AUTH &&
                    <button className="login-cas-button" type="button" onClick={casLoginHandle}>
                        <TbSchool size={18}/>
                        <span>Se connecter via l'UM</span>
                    </button>
                }
            </form>
        </LoginPage>
    );
}
