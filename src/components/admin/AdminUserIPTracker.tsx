
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download, MapPin, Activity, Clock, Ban, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export function AdminUserIPTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banningIP, setBanningIP] = useState<string | null>(null);
  const [banReason, setBanReason] = useState("");
  const [bannedIPs, setBannedIPs] = useState<string[]>([]);
  
  // Load banned IPs on component mount
  useEffect(() => {
    const storedBannedIPs = localStorage.getItem("pistaSecure_bannedIPs");
    if (storedBannedIPs) {
      setBannedIPs(JSON.parse(storedBannedIPs));
    }
  }, []);
  
  // Mock IP data - in a real app, this would come from a database
  const userIPs = [
    { 
      id: "1", 
      email: "alex@example.com", 
      ip: "192.168.1.45", 
      location: "New York, USA", 
      lastLogin: "2025-04-13 08:23:12", 
      status: "online",
      device: "Chrome / macOS",
      loginCount: 12
    },
    { 
      id: "2", 
      email: "jamie@example.com", 
      ip: "172.16.0.12", 
      location: "London, UK", 
      lastLogin: "2025-04-12 14:15:09", 
      status: "offline",
      device: "Firefox / Windows",
      loginCount: 8
    },
    { 
      id: "3", 
      email: "taylor@example.com", 
      ip: "10.0.0.5", 
      location: "Sydney, Australia", 
      lastLogin: "2025-04-13 01:42:37", 
      status: "offline",
      device: "Safari / iOS",
      loginCount: 3
    },
    { 
      id: "4", 
      email: "morgan@example.com", 
      ip: "192.168.2.123", 
      location: "Toronto, Canada", 
      lastLogin: "2025-04-11 22:18:54", 
      status: "offline",
      device: "Edge / Windows",
      loginCount: 5
    },
    { 
      id: "5", 
      email: "riley@example.com", 
      ip: "172.16.10.45", 
      location: "Berlin, Germany", 
      lastLogin: "2025-04-13 06:33:21", 
      status: "online",
      device: "Chrome / Android",
      loginCount: 7
    }
  ];
  
  // Add any locally logged in user with their IP
  const storedEmail = localStorage.getItem("pistaSecure_userEmail");
  const storedIP = localStorage.getItem("pistaSecure_userIP");
  const storedLastLogin = localStorage.getItem("pistaSecure_lastLogin");
  
  // Filter users based on search term
  const filteredUsers = userIPs.filter(
    (user) => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.ip.includes(searchTerm) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500">Online</Badge>;
      case "offline":
        return <Badge variant="outline">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleBanIP = (ip: string) => {
    setBanningIP(ip);
    setBanReason("");
    setBanModalOpen(true);
  };
  
  const confirmBanIP = () => {
    if (banningIP) {
      // Add IP to banned list
      const updatedBannedIPs = [...bannedIPs, banningIP];
      setBannedIPs(updatedBannedIPs);
      
      // Save to localStorage
      localStorage.setItem("pistaSecure_bannedIPs", JSON.stringify(updatedBannedIPs));
      
      // Update any users with this IP in the user management
      updateUsersBanStatusByIP(banningIP, banReason);
      
      toast.success(`IP address ${banningIP} has been banned`);
      setBanModalOpen(false);
    }
  };
  
  const handleUnbanIP = (ip: string) => {
    // Remove IP from banned list
    const updatedBannedIPs = bannedIPs.filter(bannedIP => bannedIP !== ip);
    setBannedIPs(updatedBannedIPs);
    
    // Save to localStorage
    localStorage.setItem("pistaSecure_bannedIPs", JSON.stringify(updatedBannedIPs));
    
    // Update ban status for any users with this IP
    removeIPBanFromUsers(ip);
    
    toast.success(`IP address ${ip} has been unbanned`);
  };
  
  // Update user ban status for all users with specific IP
  const updateUsersBanStatusByIP = (ip: string, reason: string) => {
    try {
      // Get managed users
      const managedUsersJSON = localStorage.getItem("pistaSecure_managedUsers");
      if (managedUsersJSON) {
        const managedUsers = JSON.parse(managedUsersJSON);
        
        // Update users with matching IP
        let updated = false;
        const updatedUsers = managedUsers.map((user: any) => {
          if (user.ip === ip) {
            updated = true;
            return {
              ...user,
              status: "inactive",
              accountEnabled: false,
              isBanned: true,
              banReason: reason || "IP address banned by administrator"
            };
          }
          return user;
        });
        
        if (updated) {
          localStorage.setItem("pistaSecure_managedUsers", JSON.stringify(updatedUsers));
        }
      }
    } catch (error) {
      console.error("Error updating user ban status by IP:", error);
    }
  };
  
  // Remove IP ban from users
  const removeIPBanFromUsers = (ip: string) => {
    try {
      // Get managed users
      const managedUsersJSON = localStorage.getItem("pistaSecure_managedUsers");
      if (managedUsersJSON) {
        const managedUsers = JSON.parse(managedUsersJSON);
        
        // Update users with matching IP
        let updated = false;
        const updatedUsers = managedUsers.map((user: any) => {
          if (user.ip === ip && user.isBanned) {
            updated = true;
            return {
              ...user,
              status: "inactive", // Still inactive, but no longer banned
              isBanned: false,
              banReason: ""
            };
          }
          return user;
        });
        
        if (updated) {
          localStorage.setItem("pistaSecure_managedUsers", JSON.stringify(updatedUsers));
        }
      }
    } catch (error) {
      console.error("Error removing IP ban from users:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User IP Tracker</h2>
          <p className="text-muted-foreground">Monitor and track user login locations and activities</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export IP Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Sessions</CardTitle>
            <CardDescription>Current online users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pistachio">
              2
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Unique IPs</CardTitle>
            <CardDescription>Distinct IP addresses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              5
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Banned IPs</CardTitle>
            <CardDescription>Blocked addresses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {bannedIPs.length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by email, IP or location..."
          className="pl-8 w-full sm:w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Login Count</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storedEmail && storedIP && (
              <TableRow className={bannedIPs.includes(storedIP) ? "bg-red-50" : "bg-muted/20"}>
                <TableCell className="font-medium">
                  {storedEmail} <Badge variant="outline" className="ml-2">You</Badge>
                </TableCell>
                <TableCell>{storedIP}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  Current Location
                </TableCell>
                <TableCell>Current Browser</TableCell>
                <TableCell className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {new Date(storedLastLogin || "").toLocaleString()}
                </TableCell>
                <TableCell>1</TableCell>
                <TableCell>{getStatusBadge("online")}</TableCell>
                <TableCell>
                  {bannedIPs.includes(storedIP) ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUnbanIP(storedIP)}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Unban
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleBanIP(storedIP)}
                    >
                      <Ban className="h-4 w-4 mr-1" />
                      Ban IP
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )}
            
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No user IPs found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className={bannedIPs.includes(user.ip) ? "bg-red-50" : ""}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.ip}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {user.location}
                  </TableCell>
                  <TableCell>{user.device}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {user.lastLogin}
                  </TableCell>
                  <TableCell>{user.loginCount}</TableCell>
                  <TableCell>
                    {bannedIPs.includes(user.ip) ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      getStatusBadge(user.status)
                    )}
                  </TableCell>
                  <TableCell>
                    {bannedIPs.includes(user.ip) ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUnbanIP(user.ip)}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Unban
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleBanIP(user.ip)}
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

      {/* Ban IP Dialog */}
      <Dialog open={banModalOpen} onOpenChange={setBanModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban IP Address</DialogTitle>
            <DialogDescription>
              This will ban IP address: {banningIP}. All accounts using this IP will be disabled.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="banReason" className="text-sm font-medium">Reason for Ban (optional)</label>
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
              Ban IP Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
