// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    getAuth,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    signOut,
    User,
} from "firebase/auth";

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

    const logout = () => {
        signOut(auth);
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                await setPersistence(auth, browserLocalPersistence);
                const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                    setUser(currentUser);
                    setLoading(false);
                });
                return unsubscribe;
            } catch (err) {
                console.error("Failed to set auth persistence:", err);
                setLoading(false);
            }
        };

        const unsubscribePromise = initAuth();

        return () => {
            unsubscribePromise.then((unsubscribe) => {
                if (typeof unsubscribe === "function") unsubscribe();
            });
        };
    }, [auth]);

    useEffect(() => {
        if (!user) return;

        let timeoutId: NodeJS.Timeout;

        const logoutAfterInactivity = () => {
            logout();
            alert("Logged out due to inactivity.");
        };

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(logoutAfterInactivity, 30 * 60 * 1000); // 30 mins
        };

        const activityEvents = [
            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
        ];

        activityEvents.forEach((event) =>
            window.addEventListener(event, resetTimer)
        );

        resetTimer();

        return () => {
            clearTimeout(timeoutId);
            activityEvents.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            );
        };
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
