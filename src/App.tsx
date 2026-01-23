import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import AccountLoginPage from "./pages/auth/AccountLoginPage";
import AccountRecoveryPage from "./pages/auth/AccountRecoveryPage";
import AccountActivationPage from "./pages/auth/AccountActivationPage";
import HomePage from "./pages/dashboard/HomePage";
import TERPage from "./pages/dashboard/TERPage";
import ChatPage from "./pages/dashboard/ChatPage";
import ProjectPage from "./pages/dashboard/ProjectPage";
import TERAdminPage from "./pages/dashboard/TERAdminPage";
import UsersPage from "./pages/dashboard/UsersPage";
import ArchivePage from "./pages/dashboard/ArchivePage";
import StagePage from "./pages/dashboard/StagePage";

import "./index.css";

function ProtectedRoute({ children }: { children: React.ReactNode }){
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }){
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard/home" replace />;
    }

    return <>{children}</>;
}

function RootRedirect() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return <Navigate to={isAuthenticated ? "/dashboard/home" : "/auth/login"} replace />;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/auth">
                <Route path="login" element={<PublicRoute><AccountLoginPage/></PublicRoute>}/>
                <Route path="recovery" element={<PublicRoute><AccountRecoveryPage/></PublicRoute>}/>
                <Route path="activation" element={<PublicRoute><AccountActivationPage/></PublicRoute>}/>
            </Route>

            <Route path="/dashboard">
                <Route path="home" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
               	<Route path="users" element={<ProtectedRoute><UsersPage/></ProtectedRoute>}/>
                <Route path="ter" element={<ProtectedRoute><TERPage/></ProtectedRoute>}/>
                <Route path="chat" element={<ProtectedRoute><ChatPage/></ProtectedRoute>}/>
				<Route path="stages" element={<ProtectedRoute><StagePage/></ProtectedRoute>}/>
                <Route path="archive" element={<ProtectedRoute><ArchivePage/></ProtectedRoute>}/>
				<Route path="projets" element={<ProtectedRoute><ProjectPage/></ProtectedRoute>}/>
				<Route path="admin_ter" element={<ProtectedRoute><TERAdminPage/></ProtectedRoute>}/>
            </Route>

            <Route path="/" element={<RootRedirect/>} />
            <Route path="*" element={<RootRedirect/>} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes/>
            </Router>
        </AuthProvider>
    );
}

export default App;
