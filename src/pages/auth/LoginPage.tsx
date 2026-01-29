import React from "react";
import Logo from "../../components/ui/Logo.tsx";

import "./LoginPage.css"

interface LoginPageProps {
    children: React.ReactNode;
}

export default function LoginPage({children}: LoginPageProps){
    return (
        <div className="login-page-background">
            <div className="login-page-layout">
                <Logo width={"400"} large={true} className="login-logo-style"/>

				<div className="login-page-children-style">
		 			{children}
				</div>
            </div>
        </div>
    );
}