
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

  const adminLogin = (password: string): boolean => {
    // This is a simple password check - in a real app, this would use a more secure method
    if (password === "ayman2007@4321") {
      localStorage.setItem("pistaSecure_adminAuth", "authenticated");
      setIsAdminAuthenticated(true);
      toast.success("Admin access granted");
      return true;
    } else {
      toast.error("Invalid admin credentials");
      return false;
    }
  };

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
