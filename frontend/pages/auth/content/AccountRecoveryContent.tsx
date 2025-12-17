import React from "react";
import InputField from "../../../components/input/InputField.tsx";
import Link1 from "../../../components/nav/Link1.tsx";
import SubmitButton from "../../../components/input/SubmitButton.tsx";
import InfoBox from "../../../components/ui/InfoBox.tsx";
import { IoMail } from "react-icons/io5";

import { useState } from "react";

import "./ContentStyle.css";

export default function AccountRecoveryContent(){
    const [email, setEmail] = useState("");

    const recovery_handle = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Email:", email);
    }

    return (
        <form method="POST" className="content-style-div" onSubmit={recovery_handle}>
            <InfoBox label="Veuillez saisir votre adresse e-mail pour recevoir un lien de réinitialisation de votre mot de passe."/>
            <InputField label="E-Mail" icon={<IoMail/>} is_password={false} value={email} onChange={setEmail}/>
            <Link1 label="Pas reçu de mail ?" redirection="/recovery" push_right={true}/>
            <SubmitButton label="Envoyer un mail"/>
            <Link1 label="Retour à la page de connection" redirection="/auth/login" push_right={true}  push_left={true}/>
        </form>
    );
}