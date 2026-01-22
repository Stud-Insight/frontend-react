import React from "react";
import "./LoginPage.css"

import Logo from "../../components/ui/Logo.tsx";
interface LoginPageProps {
    children: React.ReactNode;
}

export default function LoginPage({children}: LoginPageProps){
    return (
        <div className="login-page-background">
            <div className="login-page-container">
                <Logo width={"400"} large={true} className="login-logo-style"/>
                {children}
            </div>
        </div>
    );
}