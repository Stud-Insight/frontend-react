import React from "react";
import InputField from "../../../components/input/InputField.tsx";
import Link1 from "../../../components/links/Link1.tsx";
import SubmitButton from "../../../components/buttons/SubmitButton.tsx";
import InfoBox from "../../../components/InfoBox/InfoBox.tsx";
import { FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import "./AccountRecoveryPage.css"

export default function AccountRecoveryPage(){
    return (
        <div className="account-recovery-page-background">
            <div className="recovery-page-container">
                <InfoBox label="Veuillez saisir votre adresse e-mail pour recevoir un lien de réinitialisation de votre mot de passe."/>
                <InputField label="E-Mail" icon={<IoMail/>} password_type={false}/>
                <Link1 label="Mot de passe oublié ?" redirection="/recovery"/>
                <SubmitButton label="Envoyer un mail"/>

                <div className="center-div">
                    <Link1 label="Retour à la page de connection" redirection="/login"/>
                </div>
            </div>
        </div>
    );
}