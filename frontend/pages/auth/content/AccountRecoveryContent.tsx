import React from "react";
import InputField from "../../../components/input/InputField.tsx";
import Link1 from "../../../components/links/Link1.tsx";
import SubmitButton from "../../../components/buttons/SubmitButton.tsx";
import InfoBox from "../../../components/info/InfoBox.tsx";
import { IoMail } from "react-icons/io5";

import "./ContentStyle.css";

export default function AccountRecoveryContent(){
    return (
        <div className="content-style-div">
            <InfoBox label="Veuillez saisir votre adresse e-mail pour recevoir un lien de réinitialisation de votre mot de passe."/>
            <InputField label="E-Mail" icon={<IoMail/>} is_password={false}/>
            <Link1 label="Pas reçu de mail ?" redirection="/recovery" push_right={true}/>
            <SubmitButton label="Envoyer un mail"/>
            <Link1 label="Retour à la page de connection" redirection="/auth/login" push_right={true}  push_left={true}/>
        </div>
    );
}