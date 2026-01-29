import React, { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AccountLoginPage from "./pages/auth/AccountLoginPage";
import AccountRecoveryPage from "./pages/auth/AccountRecoveryPage";
import AccountActivationPage from "./pages/auth/AccountActivationPage";
import HomePage from "./pages/dashboard/HomePage";
import TERSelectionPage from "./pages/ter/user/TERSelectionPage";
import TERInfoPage from "./pages/ter/user/TERInfoPage";
import TERListPage from "./pages/ter/admin/TERListPage";
import ChatPage from "./pages/dashboard/ChatPage";
import ProjectPage from "./pages/dashboard/ProjectPage";
import TERAdminPage from "./pages/ter/admin/TERAdminPage";
import UsersPage from "./pages/dashboard/UsersPage";
import ArchivePage from "./pages/dashboard/ArchivePage";
import StagePage from "./pages/dashboard/StagePage";

import "./index.css";

interface RouteProps {
	children: ReactNode;
};

function ProtectedRoute({ children }: RouteProps){
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

function PublicRoute({ children }: RouteProps){
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
                <Route path="login" element={<PublicRoute><AccountLoginPage/></PublicRoute>}/>
                <Route path="recovery" element={<PublicRoute><AccountRecoveryPage/></PublicRoute>}/>
                <Route path="activation" element={<PublicRoute><AccountActivationPage/></PublicRoute>}/>
            </Route>

            <Route path="/dashboard">
                <Route path="home" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
               	<Route path="users" element={<ProtectedRoute><UsersPage/></ProtectedRoute>}/>
                <Route path="chat" element={<ProtectedRoute><ChatPage/></ProtectedRoute>}/>
				<Route path="stages" element={<ProtectedRoute><StagePage/></ProtectedRoute>}/>
                <Route path="archive" element={<ProtectedRoute><ArchivePage/></ProtectedRoute>}/>
				<Route path="projets" element={<ProtectedRoute><ProjectPage/></ProtectedRoute>}/>
            </Route>

			<Route path="/dashboard/ter">
				<Route path="select" element={<ProtectedRoute><TERSelectionPage/></ProtectedRoute>}/>
				<Route path="list" element={<ProtectedRoute><TERListPage/></ProtectedRoute>}/>
				<Route path="list/:id" element={<ProtectedRoute><TERAdminPage/></ProtectedRoute>}/>
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
