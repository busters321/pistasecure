import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { onAuthStateChanged, setPersistence, browserLocalPersistence, signOut, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../components/ui/firebase";

interface Subscription {
    plan?: string;
    status: string; // 'active' or 'inactive'
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
}

interface AuthContextType {
    user: User | null;
    subscription: Subscription | null;
    loading: boolean;
    logout: () => void;
    isPro: boolean;
    isActive: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        signOut(auth);
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            try {
                await setPersistence(auth, browserLocalPersistence);
                const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
                    setUser(currentUser);

                    if (!currentUser) {
                        setSubscription(null);
                        setLoading(false);
                        return;
                    }

                    // Listen to user document changes
                    const userRef = doc(db, 'users', currentUser.uid);
                    const unsubscribeSubscription = onSnapshot(userRef, (docSnap) => {
                        if (docSnap.exists()) {
                            const data = docSnap.data();

                            // Check if subscription object exists
                            if (data.subscription) {
                                setSubscription(data.subscription);
                            } else if ('subscriptionStatus' in data) {
                                // Map subscriptionStatus boolean to status string
                                setSubscription({
                                    status: data.subscriptionStatus ? "active" : "inactive",
                                    // keep plan undefined if missing
                                });
                            } else {
                                setSubscription(null);
                            }
                        } else {
                            setSubscription(null);
                        }
                        setLoading(false);
                    });

                    return () => unsubscribeSubscription();
                });

                return unsubscribeAuth;
            } catch (err) {
                console.error("Auth initialization failed:", err);
                setLoading(false);
            }
        };

        const unsubscribeAuth = initAuth();

        return () => {
            if (unsubscribeAuth && typeof unsubscribeAuth === "function") {
                unsubscribeAuth();
            }
        };
    }, []);

    // Inactivity timer
    useEffect(() => {
        if (!user) return;

        let timeoutId: NodeJS.Timeout;

        const logoutAfterInactivity = () => {
            logout();
            alert("Logged out due to inactivity.");
        };

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(logoutAfterInactivity, 30 * 60 * 1000); // 30 minutes
        };

        const activityEvents = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
        activityEvents.forEach(event => window.addEventListener(event, resetTimer));

        resetTimer();

        return () => {
            clearTimeout(timeoutId);
            activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [user, logout]);

    const isActive = subscription?.status === "active";
    const isPro = subscription?.plan === "pro" && isActive;

    const value = {
        user,
        subscription,
        loading,
        logout,
        isPro,
        isActive
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
