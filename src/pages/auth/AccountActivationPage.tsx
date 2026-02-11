import React from "react";
import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import InputField from "../../components/input/InputField.tsx";
import Button from "../../atoms/input/Button.tsx";
import HorizontalDivider from "../../components/ui/HorizontalDivider.tsx";
import InfoBox from "../../components/ui/InfoBox.tsx";
import LinkButton from "../../components/button/LinkButton.tsx";
import LoginPage from "./LoginPage.tsx";

import "./LoginPage.css"

export default function AccountActivationPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirm, setPasswordConfirm] = useState("");

    const activation_handle = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Password Confirm:", password_confirm);
    }

    return (
        <LoginPage>
            <form method="POST" className="content-style-div" onSubmit={activation_handle}>
                <InfoBox label="Veuillez renseigner un e-mail et un mot de passe pour valider la création de votre compte."/>
                <InputField label="E-Mail"  icon={<IoMail/>} value={email} onChange={setEmail} placeholder="Choisissez un e-mail"/>

                <div className="password-container">
                    <InputField label="Mot de passe" icon={<FaLock/>} value={password} onChange={setPassword} is_password={true} offset={-1.8} placeholder="Choisissez un mot de passe"/>
                    <InputField value={password_confirm} onChange={setPasswordConfirm} is_password={true} placeholder="Confirmation du mot de passe"/>
                </div>

                <HorizontalDivider/>
                <Button label="Valider"/>

                {/*TODO CREER UN CAPTCHA POUR EVIPeriod BOT */}

                <LinkButton label="Retour à la page de connection" redirection="/auth/login"/>
            </form>
        </LoginPage>
    );
}