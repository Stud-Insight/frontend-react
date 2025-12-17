import React from "react";
import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import InputField from "../../../components/input/InputField.tsx";
import SubmitButton from "../../../components/input/SubmitButton.tsx";
import Divider from "../../../components/ui/Divider.tsx";
import InfoBox from "../../../components/ui/InfoBox.tsx";
import Link1 from "../../../components/nav/Link1.tsx";

export default function AccountActivationContent(){
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
        <form method="POST" className="content-style-div" onSubmit={activation_handle}>
            <InfoBox label="Veuillez renseigner un e-mail et un mot de passe pour valider la création de votre compte."/>
            <InputField label="E-Mail" value={email} onChange={setEmail} icon={<IoMail/>}/>
            <InputField label="Mot de passe" value={password} onChange={setPassword} icon={<FaLock/>} is_password={true} offset={-1.8}/>
            <InputField label="Confirm Mot de passe" value={password_confirm} onChange={setPasswordConfirm} icon={<FaLock/>} is_password={true} offset={-1.8}/>
            <Divider/>
            <SubmitButton label="Valider"/>

            {/*TODO CREER UN CAPTCHA POUR EVITER BOT */}

            <Link1 label="Retour à la page de connection" redirection="/auth/login" push_right={true}  push_left={true}/>
        </form>
    );
}