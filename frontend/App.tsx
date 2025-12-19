import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./pages/auth/LoginPage.tsx";
import AccountLoginContent from "./pages/auth/content/AccountLoginContent.tsx";
import AccountRecoveryContent from "./pages/auth/content/AccountRecoveryContent.tsx";
import AccountActivationContent from "./pages/auth/content/AccountActivationContent.tsx";
import DashboardPage from './pages/dashboard/DashboardPage.tsx';

import "./index.css";

function App(){
    return (
        <Router>
            <Routes>
                <Route path="/dashboard" element={
                    <DashboardPage/>
                }/>

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

                <Route path="*" element={
                    // <Navigate to="/auth/login"/>
                    <Navigate to="/dashboard"/>
                }/>
            </Routes>
        </Router>
    );
}

export default App;