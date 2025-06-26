
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAuth, signInWithEmailAndPassword, User } from "firebase/auth";


interface AdminAuthContextType {
    isAdminAuthenticated: boolean;
    adminLogin: (password: string) => boolean;
    adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    // Check if admin is already authenticated on mount
    useEffect(() => {
        const adminAuthStatus = localStorage.getItem("pistaSecure_adminAuth");
        if (adminAuthStatus === "authenticated") {
            setIsAdminAuthenticated(true);
        }
    }, []);

    const auth = getAuth();

    async function adminLogin(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const tokenResult = await user.getIdTokenResult();

            if (tokenResult.claims.admin) {
                // Save admin auth state
                localStorage.setItem("pistaSecure_adminAuth", "authenticated");
                setIsAdminAuthenticated(true);
                toast.success("Admin access granted");
            } else {
                toast.error("You are not an admin");
                auth.signOut();
            }
        } catch (error) {
            toast.error("Login failed");
        }
    }

    const adminLogout = () => {
        localStorage.removeItem("pistaSecure_adminAuth");
        setIsAdminAuthenticated(false);
        toast.info("Logged out of admin panel");
        navigate("/admin");
    };

    return (
        <AdminAuthContext.Provider value={{ isAdminAuthenticated, adminLogin, adminLogout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error("useAdminAuth must be used within an AdminAuthProvider");
    }
    return context;
};