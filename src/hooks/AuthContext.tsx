import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AuthService from "../services/AuthService";
import { User } from "../services/UserService";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    error: string | null;
    clearError: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedUser = AuthService.getStoredUser();

                if (storedUser) {
                    setUser(storedUser);
                }

                const serverUser = await AuthService.getCurrentUser();
                if (serverUser) {
                    setUser(serverUser);
                } else {
                    setUser(null);
                    localStorage.removeItem("user");
                }
            } catch (err) {
                setUser(null);
                localStorage.removeItem("user");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setError(null);
        
        try {
            const response = await AuthService.login(email, password);
            setUser(response.user);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur de connexion";
            setError(message);
            throw err;
        } finally { 
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
        } catch (err) {
            // Ignorer les erreurs de déconnexion
        } finally {
            setUser(null);
            setIsLoading(false);
        }
    };

    const refreshUser = async () => {
        try {
            const currentUser = await AuthService.getCurrentUser();
            setUser(currentUser);
        } catch (err) {
            setUser(null);
        }
    };

    const clearError = () => setError(null);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        logout,
        refreshUser,
        error,
        clearError,
    };

    return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}

export default AuthContext;
