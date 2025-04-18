
// userFeatureAccess.ts - Service for managing user feature access

/**
 * Check if a specific feature is enabled for the current user
 * @param featureName The name of the feature to check
 * @returns Boolean indicating if the feature is enabled for the user
 */
export const isFeatureEnabled = (featureName: string): boolean => {
  try {
    // Get current user email
    const userEmail = localStorage.getItem("pistaSecure_userEmail");
    if (!userEmail) return false; // Not logged in
    
    // Get managed users from admin panel
    const managedUsersJSON = localStorage.getItem("pistaSecure_managedUsers");
    if (!managedUsersJSON) return false; // No managed users
    
    const managedUsers = JSON.parse(managedUsersJSON);
    
    // Find current user in managed users
    const currentUser = managedUsers.find((user: any) => user.email === userEmail);
    
    // Check if user exists, account is enabled, and not banned
    if (!currentUser || !currentUser.accountEnabled || currentUser.isBanned) {
      return false;
    }
    
    // Check specific feature access
    return currentUser.features && currentUser.features[featureName] === true;
    
  } catch (error) {
    console.error("Error checking feature access:", error);
    return false;
  }
}

/**
 * Check if the current user account is enabled and not banned
 * @returns Boolean indicating if the user account is active
 */
export const isUserAccountActive = (): boolean => {
  try {
    // Get current user email
    const userEmail = localStorage.getItem("pistaSecure_userEmail");
    if (!userEmail) return false; // Not logged in
    
    // Get managed users from admin panel
    const managedUsersJSON = localStorage.getItem("pistaSecure_managedUsers");
    if (!managedUsersJSON) return false; // No managed users
    
    const managedUsers = JSON.parse(managedUsersJSON);
    
    // Find current user in managed users
    const currentUser = managedUsers.find((user: any) => user.email === userEmail);
    
    // Check if user exists, account is enabled, and not banned
    return currentUser && currentUser.accountEnabled && !currentUser.isBanned;
    
  } catch (error) {
    console.error("Error checking user account status:", error);
    return false;
  }
}

/**
 * Get all feature access for the current user
 * @returns Object with all feature access or null if user not found
 */
export const getUserFeatures = () => {
  try {
    // Get current user email
    const userEmail = localStorage.getItem("pistaSecure_userEmail");
    if (!userEmail) return null; // Not logged in
    
    // Get managed users from admin panel
    const managedUsersJSON = localStorage.getItem("pistaSecure_managedUsers");
    if (!managedUsersJSON) return null; // No managed users
    
    const managedUsers = JSON.parse(managedUsersJSON);
    
    // Find current user in managed users
    const currentUser = managedUsers.find((user: any) => user.email === userEmail);
    
    // Return features if user exists and account is enabled
    if (currentUser && currentUser.accountEnabled && !currentUser.isBanned) {
      return currentUser.features;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user features:", error);
    return null;
  }
}

/**
 * Check if user is banned
 * @returns Boolean indicating if the user is banned and the ban reason
 */
export const checkUserBanStatus = (): { isBanned: boolean, reason: string } => {
  try {
    // Get current user email
    const userEmail = localStorage.getItem("pistaSecure_userEmail");
    if (!userEmail) return { isBanned: false, reason: "" }; // Not logged in
    
    // Get managed users from admin panel
    const managedUsersJSON = localStorage.getItem("pistaSecure_managedUsers");
    if (!managedUsersJSON) return { isBanned: false, reason: "" }; // No managed users
    
    const managedUsers = JSON.parse(managedUsersJSON);
    
    // Find current user in managed users
    const currentUser = managedUsers.find((user: any) => user.email === userEmail);
    
    // Check if user exists and is banned
    if (currentUser && currentUser.isBanned) {
      return { 
        isBanned: true, 
        reason: currentUser.banReason || "Your account has been suspended" 
      };
    }
    
    return { isBanned: false, reason: "" };
    
  } catch (error) {
    console.error("Error checking user ban status:", error);
    return { isBanned: false, reason: "" };
  }
}
