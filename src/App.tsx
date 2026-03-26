import React, { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import AccountLoginPage from "./pages/auth/AccountLoginPage";
import AccountRecoveryPage from "./pages/auth/AccountRecoveryPage";
import AccountActivationPage from "./pages/auth/AccountActivationPage";
import HomePage from "./pages/dashboard/home/HomePage";
import TERDetailPage from "./pages/dashboard/ter/TERDetailPage"
import TERPage from "./pages/dashboard/ter/TERPage";
import TERListPage from "./pages/admin/ter/TERListPage";
import ChatPage from "./pages/dashboard/ChatPage";
import SubjectPage from "./pages/dashboard/SubjectPage";
import TERGestionPage from "./pages/admin/ter/TERGestionPage";
import UsersPage from "./pages/admin/UsersPage";
import ArchivePage from "./pages/dashboard/ArchivePage";
import StagePage from "./pages/dashboard/stage/StagePage";
import StageOfferListPage from "./pages/dashboard/stage/StageOfferListPage";
import NotificationPage from "./pages/dashboard/NotificationPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import HelpPage from "./pages/dashboard/HelpPage";
import MyGroupPage from "./pages/groupes/MyGroupPage";

import "./index.css";

interface RouteProps {
    children: ReactNode;
};

function ProtectedRoute({ children }: RouteProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <>
            {children}
        </>
    );
}

function PublicRoute({ children }: RouteProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard/home" replace />;
    }

    return (
        <>
            {children}
        </>
    );
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
                <Route path="login" element={<PublicRoute><AccountLoginPage /></PublicRoute>} />
                <Route path="recovery" element={<PublicRoute><AccountRecoveryPage /></PublicRoute>} />
                <Route path="activation" element={<PublicRoute><AccountActivationPage /></PublicRoute>} />
            </Route>

            <Route path="/dashboard">
                <Route path="home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
                <Route path="chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="archive" element={<ProtectedRoute><ArchivePage /></ProtectedRoute>} />
                <Route path="subjects" element={<ProtectedRoute><SubjectPage /></ProtectedRoute>} />
                <Route path="notification" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
                <Route path="help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
                <Route path="profile">
                    <Route path="me" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path=":id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                </Route>
            </Route>

            <Route path="/dashboard/groupes/me" element={<ProtectedRoute><MyGroupPage /></ProtectedRoute>} />

            <Route path="/dashboard/stages">
                <Route path="" element={<ProtectedRoute><StagePage /></ProtectedRoute>} />

                <Route path=":period_id">
                    <Route path="list" element={<ProtectedRoute><StageOfferListPage /></ProtectedRoute>} />
                </Route>
            </Route>

            <Route path="/dashboard/ter">
                <Route path="" element={<ProtectedRoute><TERPage /></ProtectedRoute>} />

                <Route path=":id">
                    <Route path="" element={<ProtectedRoute><TERDetailPage /></ProtectedRoute>} />
                    <Route path="admin" element={<ProtectedRoute><TERGestionPage /></ProtectedRoute>} />
                </Route>

                <Route path="list" element={<ProtectedRoute><TERListPage /></ProtectedRoute>} />
            </Route>

            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<RootRedirect />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;

