import React from "react";
import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import InputField from "../../../components/input/InputField.tsx";
import SubmitButton from "../../../components/buttons/SubmitButton.tsx";
import Divider from "../../../components/divider/Divider.tsx";
import InfoBox from "../../../components/info/InfoBox.tsx";
import Link1 from "../../../components/links/Link1.tsx";

export default function AccountActivationContent(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirm, setPasswordConfirm] = useState("");

    const handle_activation = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Password Confirm:", password_confirm);
    }

    return (
        <form method="POST" className="content-style-div" onSubmit={handle_activation}>
            <InfoBox label="Veuillez renseigner un e-mail valide et un mot de passe pour valider la création de votre compte."/>
            <InputField label="E-Mail" value={email} onChange={setEmail} icon={<IoMail/>}/>
            <InputField label="Mot de passe" value={password} onChange={setPassword} icon={<FaLock/>} is_password={true} offset={-1.8}/>
            <InputField label="Confirm Mot de passe" value={password_confirm} onChange={setPasswordConfirm} icon={<FaLock/>} is_password={true} offset={-1.8}/>
            <Divider/>
            <SubmitButton label="Valider"/>
            <Link1 label="Retour à la page de connection" redirection="/auth/login" push_right={true}  push_left={true}/>
        </form>
    );
}