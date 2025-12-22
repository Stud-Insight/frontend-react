import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import AccountLoginPage from "./pages/auth/AccountLoginPage";
import AccountRecoveryPage from "./pages/auth/AccountRecoveryPage";
import AccountActivationPage from "./pages/auth/AccountActivationPage";
import HomePage from "./pages/dashboard/HomePage";
import UsersPage from "./pages/dashboard/UsersPage";
import FilesPage from "./pages/dashboard/FilesPage";

import "./index.css";

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    return <>{children}</>;
}

// Public route wrapper (redirect to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard/home" replace />;
    }

    return <>{children}</>;
}

// Root redirect based on auth status
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
            {/* Auth routes - redirect to dashboard if already logged in */}
            <Route path="/auth">
                <Route
                    path="login"
                    element={
                        <PublicRoute>
                            <AccountLoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="recovery"
                    element={
                        <PublicRoute>
                            <AccountRecoveryPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="activation"
                    element={
                        <PublicRoute>
                            <AccountActivationPage />
                        </PublicRoute>
                    }
                />
            </Route>

            {/* Dashboard routes - protected */}
            <Route path="/dashboard">
                <Route
                    path="home"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="users"
                    element={
                        <ProtectedRoute>
                            <UsersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="stage"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="ter"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="files"
                    element={
                        <ProtectedRoute>
                            <FilesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="archive"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="notification"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="settings"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Root redirect */}
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
