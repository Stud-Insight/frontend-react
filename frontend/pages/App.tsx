import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from "./auth/LoginPage.tsx";
import AccountLoginContent from "./auth/content/AccountLoginContent.tsx";
import AccountRecoveryContent from "./auth/content/AccountRecoveryContent.tsx";
import AccountActivationContent from "./auth/content/AccountActivationContent.tsx";
import "../index.css";

function App(){

    return (
        <Router>
            <Routes>
                <Route path="/auth/login" element={
                    <LoginPage>
                        <AccountLoginContent/>
                    </LoginPage>
                }/>

                 <Route path="/auth/recovery" element={
                    <LoginPage>
                        <AccountRecoveryContent/>
                    </LoginPage>
                }/>

                <Route path="/auth/activation" element={
                    <LoginPage>
                        <AccountActivationContent/>
                    </LoginPage>
                }/>

                <Route path="*" element={<Navigate to="/auth/login"/>}/>
            </Routes>
        </Router>
    );
}

export default App;