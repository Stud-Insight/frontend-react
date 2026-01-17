import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import UserService, { User } from "../services/UserService";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Verifier l'authentification au chargement
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // D'abord essayer le localStorage pour un affichage rapide
                const storedUser = UserService.getStoredUser();
                if (storedUser) {
                    setUser(storedUser);
                }

                // Toujours verifier avec le serveur (session cookie)
                const serverUser = await UserService.getCurrentUser();
                if (serverUser) {
                    setUser(serverUser);
                } else {
                    // Session invalide, nettoyer
                    setUser(null);
                    localStorage.removeItem("user");
                }
            } catch (err) {
                // Erreur reseau ou non authentifie
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
            const response = await UserService.login(email, password);
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
            await UserService.logout();
        } catch (err) {
            // Ignorer les erreurs de deconnexion
        } finally {
            setUser(null);
            setIsLoading(false);
        }
    };

    const refreshUser = async () => {
        try {
            const currentUser = await UserService.getCurrentUser();
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

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthContext;
