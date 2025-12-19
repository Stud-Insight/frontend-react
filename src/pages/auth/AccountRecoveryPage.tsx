import React from "react";
import InputField from "../../components/input/InputField.tsx";
import LinkButton from "../../components/nav/LinkButton.tsx";
import SubmitButton from "../../components/input/SubmitButton.tsx";
import InfoBox from "../../components/ui/InfoBox.tsx";
import Divider from "../../components/ui/Divider.tsx";
import LoginPage from "./LoginPage.tsx";
import { IoMail } from "react-icons/io5";
import { useState } from "react";

import "./LoginPage.css"

export default function AccountRecoveryPage(){
    const [email, setEmail] = useState("");

    const recovery_handle = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Email:", email);
    }

    return (
        <LoginPage>
            <form method="POST" className="content-style-div" onSubmit={recovery_handle}>
                <InfoBox label="Veuillez saisir votre adresse e-mail pour recevoir un lien de réinitialisation de votre mot de passe."/>
                <InputField label="E-Mail" icon={<IoMail/>} is_password={false} value={email} onChange={setEmail}/>
                <LinkButton label="Pas reçu de mail ?" redirection="/auth/login" push_right={true}/>
                <Divider/>
                <SubmitButton label="Envoyer un mail"/>
                <LinkButton label="Retour à la page de connection" redirection="/auth/login" push_right={true}  push_left={true}/>
            </form>
        </LoginPage>
    );
}