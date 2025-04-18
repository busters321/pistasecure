
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { isFeatureEnabled, isUserAccountActive, checkUserBanStatus } from "@/lib/userFeatureAccess";

type Features = {
  scamIntelligence: boolean;
  linkInspection: boolean;
  emailScanner: boolean;
  cyberCopilot: boolean;
  safeView: boolean;
  socialProtection: boolean;
  passwordChecker: boolean;
};

interface FeatureAccessContextType {
  isAuthenticated: boolean;
  isAccountActive: boolean;
  isBanned: boolean;
  banReason: string;
  canAccess: (featureName: keyof Features) => boolean;
  checkAccess: () => void;
}

const FeatureAccessContext = createContext<FeatureAccessContextType | undefined>(undefined);

export const FeatureAccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAccountActive, setIsAccountActive] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [banReason, setBanReason] = useState("");
  
  const checkAccess = () => {
    // Check if user is logged in
    const userEmail = localStorage.getItem("pistaSecure_userEmail");
    setIsAuthenticated(!!userEmail);
    
    // Check if account is active
    setIsAccountActive(isUserAccountActive());
    
    // Check if user is banned
    const banStatus = checkUserBanStatus();
    setIsBanned(banStatus.isBanned);
    setBanReason(banStatus.reason);
    
    // Show toast if user is banned
    if (banStatus.isBanned && banStatus.reason) {
      toast.error(banStatus.reason);
    }
  };
  
  // Check access when component mounts
  useEffect(() => {
    checkAccess();
    
    // Set up an interval to periodically check for ban status changes
    const interval = setInterval(checkAccess, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to check if user can access a specific feature
  const canAccess = (featureName: keyof Features): boolean => {
    // If user is not authenticated or account is not active or is banned, they can't access features
    if (!isAuthenticated || !isAccountActive || isBanned) {
      return false;
    }
    
    // Check specific feature access
    return isFeatureEnabled(featureName);
  };
  
  return (
    <FeatureAccessContext.Provider value={{ 
      isAuthenticated, 
      isAccountActive, 
      isBanned, 
      banReason,
      canAccess,
      checkAccess
    }}>
      {children}
    </FeatureAccessContext.Provider>
  );
};

export const useFeatureAccess = () => {
  const context = useContext(FeatureAccessContext);
  
  if (context === undefined) {
    throw new Error("useFeatureAccess must be used within a FeatureAccessProvider");
  }
  
  return context;
};
