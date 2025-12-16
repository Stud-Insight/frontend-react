import React from "react";
import InputField from "../../../components/input/InputField/InputField.tsx";
import SubmitButton from "../../../components/buttons/SubmitButton/SubmitButton.tsx";
import { FaLock } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import "./LoginPage.css"

export default function LoginPage(){
    return (
        <div className="login-page-background">   
            <div className="login-page">
                <InputField label="E-Mail" icon={<IoMail/>} password_type={false}/>
                <InputField label="Mot de passe" icon={<FaLock/>} password_type={true}/>
                <SubmitButton label="Se connecter"/>
                <SubmitButton label="Se connecter via l'UM" icon_path="../../../assets/logo_um.png"/>
            </div>
        </div>
    );
}