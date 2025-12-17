import React from "react";
import InputField from "../../../components/input/InputField.tsx"
import SubmitButton from "../../../components/input/SubmitButton.tsx";
import Link1 from "../../../components/nav/Link1.tsx";
import Divider from "../../../components/ui/Divider.tsx";
import UserService from "../../../service/UserService.ts";

import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import "./ContentStyle.css";

export default function AccountLoginContent(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login_handle = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);

        try {
            const data = await UserService.login(email, password);
        } catch (error: any){
            console.error(error.message);
        }
    }

    return (
       <form method="POST" className="content-style-div" onSubmit={login_handle}>
            <InputField label="E-Mail" value={email} onChange={setEmail} icon={<IoMail/>}/>
            <InputField label="Mot de passe" value={password} onChange={setPassword} icon={<FaLock/>} is_password={true} offset={-1.8}/>
            <Link1 label="Mot de passe oublié ?" redirection="/auth/recovery" push_right={true}/>
            <SubmitButton label="Se connecter" type="submit"/>
            <Divider label="ou"/>
            <SubmitButton label="Se connecter via l'UM" style={"um"}/>
            <Link1 label="Créer un compte ?" redirection="/auth/activation" push_right={true} push_left={true}/>
        </form>
    );
}