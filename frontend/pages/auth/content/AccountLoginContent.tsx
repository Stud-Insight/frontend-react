import React from "react";
import InputField from "../../../components/input/InputField.tsx"
import Link1 from "../../../components/links/Link1.tsx";
import SubmitButton from "../../../components/buttons/SubmitButton.tsx";
import Divider from "../../../components/divider/Divider.tsx";
import SubmitButtonUM from "../../../components/buttons/SubmitButtonUM.tsx";
import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import "./ContentStyle.css";

export default function AccountLoginContent(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handle_login = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
    }

    return (
       <form method="POST" className="content-style-div" onSubmit={handle_login}>
            <InputField label="E-Mail" value={email} onChange={setEmail} icon={<IoMail/>}/>
            <InputField label="Mot de passe" value={password} onChange={setPassword} icon={<FaLock/>} is_password={true} offset={-1.8}/>
            <Link1 label="Mot de passe oublié ?" redirection="/auth/recovery" push_right={true}/>
            <SubmitButton label="Se connecter" type="submit"/>
            {/* <Divider label="ou"/>
            <SubmitButton label="Créer un compte"/> */}
            {/* <SubmitButtonUM label="Se connecter via l'UM"/> */}
            <Link1 label="Créer un compte ?" redirection="/auth/activation" push_right={true} push_left={true}/>
        </form>
    );
}