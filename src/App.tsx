import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./pages/auth/LoginPage.tsx";
import AccountLoginPage from "./pages/auth/AccountLoginPage.tsx";
import AccountRecoveryPage from "./pages/auth/AccountRecoveryPage.tsx";
import AccountActivationPage from "./pages/auth/AccountActivationPage.tsx";
import HomePage from "./pages/dashboard/HomePage.tsx";
import UsersPage from "./pages/dashboard/UsersPage.tsx";

import "./index.css";

function App(){
    return (
        <Router>
            <Routes>
                <Route path="/auth">
                    <Route path="login" element={<AccountLoginPage/>}/>
                    <Route path="recovery" element={<AccountRecoveryPage/>} />
                    <Route path="activation" element={<AccountActivationPage/>} />
                </Route>

                <Route path="/dashboard">
                    <Route path="home" element={<HomePage/>}/>
                    <Route path="users" element={<UsersPage/>} />
                    <Route path="stage" element={<HomePage/>} />
                    <Route path="ter" element={<HomePage/>} />
                    <Route path="archive" element={<HomePage/>} />
                    <Route path="notification" element={<HomePage/>} />
                    <Route path="settings" element={<HomePage/>} />
                </Route>
               
                <Route path="*" element={<Navigate to="/auth/login"/>}/>
            </Routes>
        </Router>
    );
}

export default App;