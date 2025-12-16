import React from "react";
import LoginPage from "./auth/LoginPage/LoginPage.tsx";

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import "../index.css";

function App(){

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>} />
            </Routes>
        </Router>
    );
}

export default App;