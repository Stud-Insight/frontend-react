import React from "react";
import InputField from "../../../components/input/InputField.tsx";
import Link1 from "../../../components/links/Link1.tsx";
import SubmitButton from "../../../components/buttons/SubmitButton.tsx";
import InfoBox from "../../../components/InfoBox/InfoBox.tsx";
import { IoMail } from "react-icons/io5";

import "./ContentStyle.css";

export default function AccountRecoveryContent(){
    return (
        <div className="content-style-div">
            <InfoBox label="Veuillez saisir votre adresse e-mail pour recevoir un lien de réinitialisation de votre mot de passe."/>
            <InputField label="E-Mail" icon={<IoMail/>} is_password={false}/>
            <Link1 label="Pas reçu de mail ?" redirection="/recovery"/>
            <SubmitButton label="Envoyer un mail"/>

            <div className="center-div">
                <Link1 label="Retour à la page de connection" redirection="/login"/>
            </div>
        </div>
    );
}