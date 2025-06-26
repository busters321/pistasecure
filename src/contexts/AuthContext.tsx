// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = getAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Logout function
    const logout = () => {
        signOut(auth);
    };

    useEffect(() => {
        // Listen to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, [auth]);

    // Inactivity logout logic
    useEffect(() => {
        if (!user) return;

        let timeoutId: NodeJS.Timeout;

        // Logout after 30 minutes of inactivity
        const logoutAfterInactivity = () => {
            logout();
            alert("Logged out due to inactivity.");
        };

        // Reset inactivity timer
        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(logoutAfterInactivity, 30 * 60 * 1000); // 1 minute
        };

        // List of events to detect activity
        const activityEvents = [
            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
        ];

        // Attach event listeners
        activityEvents.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        // Start timer initially
        resetTimer();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            activityEvents.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
