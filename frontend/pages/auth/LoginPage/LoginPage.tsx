import React from "react";
import InputField from "../../../components/input/InputField.tsx";
import SubmitButton from "../../../components/buttons/SubmitButton.tsx";
import SubmitButtonUM from "../../../components/buttons/SubmitButtonUM.tsx";
import Separator1 from "../../../components/separator/Separator1/Separator1.tsx";
import Link1 from "../../../components/links/Link1.tsx";
import { FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import "./LoginPage.css"

export default function LoginPage(){
    return (
        <div className="login-page-background">   
            <div className="login-page-container">
                <InputField label="E-Mail" icon={<IoMail/>} password_type={false}/>
                <InputField label="Mot de passe" icon={<FaLock/>} password_type={true}/>
                <Link1 label="Mot de passe oublié ?" redirection="/recovery"/>
                <SubmitButton label="Se connecter"/>
                <Separator1/>
                <SubmitButtonUM label="Se connecter via l'UM"/>
            </div>
        </div>
    );
}