import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from "./auth/LoginPage/LoginPage.tsx";
import AccountRecoveryPage from "./auth/AccountRecoveryPage/AccountRecoveryPage.tsx";

import "../index.css";

function App(){

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/recovery" element={<AccountRecoveryPage/>}/>
                <Route path="/" element={<LoginPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;