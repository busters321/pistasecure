
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, ChevronLeft, ChevronRight, Filter, UserCog, Shield, UserMinus, UserCheck, Ban, UserPlus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function AdminUsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [managingUser, setManagingUser] = useState<any>(null);
  const [userManagementOpen, setUserManagementOpen] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  // Mock user data - in a real app, this would come from a database
  const [users, setUsers] = useState([
    { 
      id: "1", 
      name: "Alex Johnson", 
      email: "alex@example.com", 
      status: "active", 
      role: "user", 
      joined: "Mar 14, 2024",
      ip: "192.168.1.45",
      accountEnabled: true,
      features: {
        scamIntelligence: true,
        linkInspection: true,
        emailScanner: true,
        cyberCopilot: false,
        safeView: true,
        socialProtection: false,
        passwordChecker: true
      },
      isBanned: false,
      banReason: ""
    },
    { 
      id: "2", 
      name: "Jamie Smith", 
      email: "jamie@example.com", 
      status: "active", 
      role: "admin", 
      joined: "Jan 5, 2024",
      ip: "172.16.0.12",
      accountEnabled: true,
      features: {
        scamIntelligence: true,
        linkInspection: true,
        emailScanner: true,
        cyberCopilot: true,
        safeView: true,
        socialProtection: true,
        passwordChecker: true
      },
      isBanned: false,
      banReason: ""
    },
    { 
      id: "3", 
      name: "Taylor Doe", 
      email: "taylor@example.com", 
      status: "inactive", 
      role: "user", 
      joined: "Apr 2, 2024",
      ip: "10.0.0.5",
      accountEnabled: false,
      features: {
        scamIntelligence: false,
        linkInspection: false,
        emailScanner: false,
        cyberCopilot: false,
        safeView: false,
        socialProtection: false,
        passwordChecker: false
      },
      isBanned: true,
      banReason: "Suspicious activity detected"
    }
  ]);

  useEffect(() => {
    // Load all signed-up users from local storage
    const loadSignedUpUsers = () => {
      try {
        const storedUsers = localStorage.getItem("pistaSecure_users");
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          
          // Map the stored users to match our user structure
          const mappedUsers = parsedUsers.map((user: any, index: number) => {
            // Check if this user is already in our list
            const existingUserIndex = users.findIndex(u => u.email === user.email);
            if (existingUserIndex >= 0) {
              return null; // Skip existing users
            }
            
            return {
              id: (users.length + index + 1).toString(),
              name: user.fullName || user.email.split('@')[0],
              email: user.email,
              status: "pending",
              role: "user",
              joined: new Date(user.joinDate || Date.now()).toLocaleDateString(),
              ip: user.ip || "Unknown",
              accountEnabled: false, // Default to disabled
              features: {
                scamIntelligence: false,
                linkInspection: false,
                emailScanner: false,
                cyberCopilot: false,
                safeView: false,
                socialProtection: false,
                passwordChecker: false
              },
              isBanned: false,
              banReason: ""
            };
          }).filter(Boolean); // Remove null entries (already existing users)
          
          if (mappedUsers.length > 0) {
            setUsers(prevUsers => [...prevUsers, ...mappedUsers]);
          }
        }
      } catch (error) {
        console.error("Error loading signed-up users:", error);
      }
    };
    
    loadSignedUpUsers();
    
    // Save the current users to localStorage for feature access
    saveUsersToLocalStorage(users);
  }, []);
  
  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleManageUser = (user: any) => {
    setManagingUser(user);
    setUserManagementOpen(true);
  };

  const handleBanIP = (user: any) => {
    setManagingUser(user);
    setBanReason("");
    setBanModalOpen(true);
  };

  const confirmBanIP = () => {
    if (managingUser) {
      const updatedUsers = users.map(user => {
        if (user.id === managingUser.id) {
          return {
            ...user,
            status: "inactive",
            accountEnabled: false,
            isBanned: true,
            banReason: banReason || "Administrative action"
          };
        }
        return user;
      });
      
      // Also ban all users with the same IP
      const bannedIP = managingUser.ip;
      if (bannedIP !== "Unknown") {
        updatedUsers.forEach(user => {
          if (user.ip === bannedIP && user.id !== managingUser.id) {
            user.status = "inactive";
            user.accountEnabled = false;
            user.isBanned = true;
            user.banReason = `IP address banned: ${banReason || "Administrative action"}`;
          }
        });
      }
      
      setUsers(updatedUsers);
      saveUsersToLocalStorage(updatedUsers);
      setBanModalOpen(false);
      toast.success(`Banned user ${managingUser.email} and associated IP: ${managingUser.ip}`);
    }
  };

  const handleUnbanIP = (userId: string) => {
    const userToUnban = users.find(user => user.id === userId);
    if (userToUnban) {
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            status: "pending",
            isBanned: false,
            banReason: ""
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      saveUsersToLocalStorage(updatedUsers);
      toast.success(`Unbanned user ${userToUnban.email}`);
    }
  };

  const updateUserFeatureAccess = (userId: string, feature: string, enabled: boolean) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          features: {
            ...user.features,
            [feature]: enabled
          }
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    saveUsersToLocalStorage(updatedUsers);
  };

  const toggleAccountStatus = (userId: string, enabled: boolean) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          accountEnabled: enabled,
          status: enabled ? "active" : "inactive"
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    saveUsersToLocalStorage(updatedUsers);
    
    const affectedUser = users.find(user => user.id === userId);
    if (affectedUser) {
      toast.success(`${enabled ? "Activated" : "Deactivated"} account for ${affectedUser.email}`);
    }
  };

  // Save users to localStorage for persistence and feature access
  const saveUsersToLocalStorage = (updatedUsers: any[]) => {
    try {
      localStorage.setItem("pistaSecure_managedUsers", JSON.stringify(updatedUsers));
    } catch (error) {
      console.error("Error saving user changes:", error);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error("No users selected");
      return;
    }
    
    let updatedUsers = [...users];
    
    switch (action) {
      case "activate":
        updatedUsers = users.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, accountEnabled: true, status: "active" } 
            : user
        );
        toast.success(`Activated ${selectedUsers.length} accounts`);
        break;
        
      case "deactivate":
        updatedUsers = users.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, accountEnabled: false, status: "inactive" } 
            : user
        );
        toast.success(`Deactivated ${selectedUsers.length} accounts`);
        break;
        
      case "ban":
        updatedUsers = users.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, accountEnabled: false, status: "inactive", isBanned: true, banReason: "Bulk action" } 
            : user
        );
        toast.success(`Banned ${selectedUsers.length} accounts`);
        break;
    }
    
    setUsers(updatedUsers);
    saveUsersToLocalStorage(updatedUsers);
    setSelectedUsers([]);
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Check if email already exists
    if (users.some(user => user.email === newUser.email)) {
      toast.error("User with this email already exists");
      return;
    }
    
    const newId = (users.length + 1).toString();
    const userToAdd = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      status: "pending",
      role: "user",
      joined: new Date().toLocaleDateString(),
      ip: "192.168." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
      accountEnabled: false,
      features: {
        scamIntelligence: false,
        linkInspection: false,
        emailScanner: false,
        cyberCopilot: false,
        safeView: false,
        socialProtection: false,
        passwordChecker: false
      },
      isBanned: false,
      banReason: ""
    };
    
    // Add to users list
    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    
    // Add to registered users
    const storedUsers = localStorage.getItem("pistaSecure_users");
    const existingUsers = storedUsers ? JSON.parse(storedUsers) : [];
    existingUsers.push({
      email: newUser.email,
      password: newUser.password,
      fullName: newUser.name,
      joinDate: new Date().toISOString(),
      ip: userToAdd.ip
    });
    localStorage.setItem("pistaSecure_users", JSON.stringify(existingUsers));
    
    // Save for feature access
    saveUsersToLocalStorage(updatedUsers);
    
    // Reset form and close modal
    setNewUser({ name: "", email: "", password: "" });
    setAddUserOpen(false);
    
    toast.success(`Added new user: ${newUser.email}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">View and manage registered users</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 self-end">
          {selectedUsers.length > 0 && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleBulkAction("activate")}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Activate
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleBulkAction("deactivate")}
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Deactivate
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleBulkAction("ban")}
              >
                <Ban className="h-4 w-4 mr-2" />
                Ban
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" disabled={selectedUsers.length === 0}>
            <UserCog className="h-4 w-4 mr-2" />
            Manage Selected ({selectedUsers.length})
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-pistachio hover:bg-pistachio-dark text-black"
            onClick={() => setAddUserOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  onChange={() => {
                    if (selectedUsers.length === filteredUsers.length) {
                      setSelectedUsers([]);
                    } else {
                      setSelectedUsers(filteredUsers.map(user => user.id));
                    }
                  }}
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className={user.isBanned ? "bg-red-50" : ""}>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={user.accountEnabled} 
                      onCheckedChange={(checked) => toggleAccountStatus(user.id, checked)}
                      disabled={user.isBanned}
                    />
                  </TableCell>
                  <TableCell>
                    {user.ip || "Unknown"}
                    {user.isBanned && (
                      <Badge variant="destructive" className="ml-2">Banned</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleManageUser(user)}
                    >
                      Features
                    </Button>
                    {user.isBanned ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUnbanIP(user.id)}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Unban
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleBanIP(user)}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Ban IP
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>1</strong> to <strong>{filteredUsers.length}</strong> of{" "}
          <strong>{filteredUsers.length}</strong> results
        </p>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page => page + 1)}
            disabled={true} // In a real app, this would be based on total pages
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User Feature Management Sheet */}
      <Sheet open={userManagementOpen} onOpenChange={setUserManagementOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>User Features Control</SheetTitle>
            <SheetDescription>
              {managingUser ? `Managing features for ${managingUser.email}` : "Select a user to manage features"}
            </SheetDescription>
          </SheetHeader>
          
          {managingUser && (
            <div className="py-6 space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Scam Intelligence</h3>
                    <p className="text-sm text-muted-foreground">AI-powered scam detection</p>
                  </div>
                  <Switch 
                    checked={managingUser.features.scamIntelligence} 
                    onCheckedChange={(checked) => {
                      const updatedUser = {
                        ...managingUser,
                        features: {
                          ...managingUser.features,
                          scamIntelligence: checked
                        }
                      };
                      setManagingUser(updatedUser);
                      updateUserFeatureAccess(managingUser.id, "scamIntelligence", checked);
                    }}
                    disabled={!managingUser.accountEnabled || managingUser.isBanned}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Link Inspection</h3>
                    <p className="text-sm text-muted-foreground">URL safety analysis</p>
                  </div>
                  <Switch 
                    checked={managingUser.features.linkInspection}
                    onCheckedChange={(checked) => {
                      const updatedUser = {
                        ...managingUser,
                        features: {
                          ...managingUser.features,
                          linkInspection: checked
                        }
                      };
                      setManagingUser(updatedUser);
                      updateUserFeatureAccess(managingUser.id, "linkInspection", checked);
                    }}
                    disabled={!managingUser.accountEnabled || managingUser.isBanned}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Scanner</h3>
                    <p className="text-sm text-muted-foreground">Email content analysis</p>
                  </div>
                  <Switch 
                    checked={managingUser.features.emailScanner}
                    onCheckedChange={(checked) => {
                      const updatedUser = {
                        ...managingUser,
                        features: {
                          ...managingUser.features,
                          emailScanner: checked
                        }
                      };
                      setManagingUser(updatedUser);
                      updateUserFeatureAccess(managingUser.id, "emailScanner", checked);
                    }}
                    disabled={!managingUser.accountEnabled || managingUser.isBanned}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Cyber Copilot</h3>
                    <p className="text-sm text-muted-foreground">AI security assistant</p>
                  </div>
                  <Switch 
                    checked={managingUser.features.cyberCopilot}
                    onCheckedChange={(checked) => {
                      const updatedUser = {
                        ...managingUser,
                        features: {
                          ...managingUser.features,
                          cyberCopilot: checked
                        }
                      };
                      setManagingUser(updatedUser);
                      updateUserFeatureAccess(managingUser.id, "cyberCopilot", checked);
                    }}
                    disabled={!managingUser.accountEnabled || managingUser.isBanned}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SafeView Browser</h3>
                    <p className="text-sm text-muted-foreground">Secure browsing environment</p>
                  </div>
                  <Switch 
                    checked={managingUser.features.safeView}
                    onCheckedChange={(checked) => {
                      const updatedUser = {
                        ...managingUser,
                        features: {
                          ...managingUser.features,
                          safeView: checked
                        }
                      };
                      setManagingUser(updatedUser);
                      updateUserFeatureAccess(managingUser.id, "safeView", checked);
                    }}
                    disabled={!managingUser.accountEnabled || managingUser.isBanned}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Social Media Protection</h3>
                    <p className="text-sm text-muted-foreground">Social account security</p>
                  </div>
                  <Switch 
                    checked={managingUser.features.socialProtection}
                    onCheckedChange={(checked) => {
                      const updatedUser = {
                        ...managingUser,
                        features: {
                          ...managingUser.features,
                          socialProtection: checked
                        }
                      };
                      setManagingUser(updatedUser);
                      updateUserFeatureAccess(managingUser.id, "socialProtection", checked);
                    }}
                    disabled={!managingUser.accountEnabled || managingUser.isBanned}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Password Checker</h3>
                    <p className="text-sm text-muted-foreground">Password security analysis</p>
                  </div>
                  <Switch 
                    checked={managingUser.features.passwordChecker}
                    onCheckedChange={(checked) => {
                      const updatedUser = {
                        ...managingUser,
                        features: {
                          ...managingUser.features,
                          passwordChecker: checked
                        }
                      };
                      setManagingUser(updatedUser);
                      updateUserFeatureAccess(managingUser.id, "passwordChecker", checked);
                    }}
                    disabled={!managingUser.accountEnabled || managingUser.isBanned}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setUserManagementOpen(false)}
                  >
                    Close
                  </Button>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Disable all features
                        const updatedUser = {
                          ...managingUser,
                          features: {
                            scamIntelligence: false,
                            linkInspection: false,
                            emailScanner: false,
                            cyberCopilot: false,
                            safeView: false,
                            socialProtection: false,
                            passwordChecker: false
                          }
                        };
                        setManagingUser(updatedUser);
                        
                        // Update each feature in the users array
                        Object.keys(updatedUser.features).forEach(feature => {
                          updateUserFeatureAccess(managingUser.id, feature, false);
                        });
                        
                        toast.success("Disabled all features for this user");
                      }}
                      disabled={!managingUser.accountEnabled || managingUser.isBanned}
                    >
                      Disable All
                    </Button>
                    <Button
                      onClick={() => {
                        // Enable all features
                        const updatedUser = {
                          ...managingUser,
                          features: {
                            scamIntelligence: true,
                            linkInspection: true,
                            emailScanner: true,
                            cyberCopilot: true,
                            safeView: true,
                            socialProtection: true,
                            passwordChecker: true
                          }
                        };
                        setManagingUser(updatedUser);
                        
                        // Update each feature in the users array
                        Object.keys(updatedUser.features).forEach(feature => {
                          updateUserFeatureAccess(managingUser.id, feature, true);
                        });
                        
                        toast.success("Enabled all features for this user");
                      }}
                      disabled={!managingUser.accountEnabled || managingUser.isBanned}
                    >
                      Enable All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Ban IP Dialog */}
      <Dialog open={banModalOpen} onOpenChange={setBanModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User and IP Address</DialogTitle>
            <DialogDescription>
              {managingUser ? 
                `This will ban ${managingUser.email} and block their IP address: ${managingUser.ip}. All other accounts using this IP will also be disabled.` :
                "Select a user to ban"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <FormLabel htmlFor="banReason">Reason for Ban (optional)</FormLabel>
                <Input
                  id="banReason"
                  placeholder="Suspicious activity, abuse, etc."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBanModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBanIP}
            >
              Ban User & IP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with default settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <FormLabel htmlFor="userName">Full Name</FormLabel>
                <Input
                  id="userName"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <FormLabel htmlFor="userEmail">Email</FormLabel>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <FormLabel htmlFor="userPassword">Password</FormLabel>
                <Input
                  id="userPassword"
                  type="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddUserOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
