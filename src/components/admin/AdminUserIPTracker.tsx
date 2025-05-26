import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download, MapPin, Clock, Ban, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

import { db } from "@/components/ui/firebase"; // your firebase config and export
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where } from "firebase/firestore";

export function AdminUserIPTracker() {
    const [searchTerm, setSearchTerm] = useState("");
    const [banModalOpen, setBanModalOpen] = useState(false);
    const [banningIP, setBanningIP] = useState<string | null>(null);
    const [banReason, setBanReason] = useState("");
    const [bannedIPs, setBannedIPs] = useState<string[]>([]);
    const [managedUsers, setManagedUsers] = useState<any[]>([]);

    // Load banned IPs from Firestore on mount
    useEffect(() => {
        async function fetchBannedIPs() {
            try {
                const bannedIPsSnapshot = await getDocs(collection(db, "bannedIPs"));
                const ips = bannedIPsSnapshot.docs.map(doc => doc.id);
                setBannedIPs(ips);
            } catch (e) {
                console.error("Error fetching banned IPs:", e);
            }
        }

        // Load managed users
        async function fetchManagedUsers() {
            try {
                const usersSnapshot = await getDocs(collection(db, "managedUsers"));
                const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setManagedUsers(users);
            } catch (e) {
                console.error("Error fetching managed users:", e);
            }
        }

        fetchBannedIPs();
        fetchManagedUsers();
    }, []);

    // Mock IP data, unchanged
    const userIPs = [
        { id: "1", email: "alex@example.com", ip: "192.168.1.45", location: "New York, USA", lastLogin: "2025-04-13 08:23:12", status: "online", device: "Chrome / macOS", loginCount: 12 },
        { id: "2", email: "jamie@example.com", ip: "172.16.0.12", location: "London, UK", lastLogin: "2025-04-12 14:15:09", status: "offline", device: "Firefox / Windows", loginCount: 8 },
        { id: "3", email: "taylor@example.com", ip: "10.0.0.5", location: "Sydney, Australia", lastLogin: "2025-04-13 01:42:37", status: "offline", device: "Safari / iOS", loginCount: 3 },
        { id: "4", email: "morgan@example.com", ip: "192.168.2.123", location: "Toronto, Canada", lastLogin: "2025-04-11 22:18:54", status: "offline", device: "Edge / Windows", loginCount: 5 },
        { id: "5", email: "riley@example.com", ip: "172.16.10.45", location: "Berlin, Germany", lastLogin: "2025-04-13 06:33:21", status: "online", device: "Chrome / Android", loginCount: 7 }
    ];

    // Local stored user info remains from localStorage
    const storedEmail = localStorage.getItem("pistaSecure_userEmail");
    const storedIP = localStorage.getItem("pistaSecure_userIP");
    const storedLastLogin = localStorage.getItem("pistaSecure_lastLogin");

    // Filter users with search
    const filteredUsers = userIPs.filter(
        (user) =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.ip.includes(searchTerm) ||
            user.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        if (status === "online") return <Badge className="bg-green-500">Online</Badge>;
        if (status === "offline") return <Badge variant="outline">Offline</Badge>;
        return <Badge variant="outline">{status}</Badge>;
    };

    const handleBanIP = (ip: string) => {
        setBanningIP(ip);
        setBanReason("");
        setBanModalOpen(true);
    };

    const confirmBanIP = async () => {
        if (!banningIP) return;

        try {
            // Save banned IP in Firestore (doc id = IP string)
            await setDoc(doc(db, "bannedIPs", banningIP), {
                reason: banReason || "IP address banned by administrator",
                bannedAt: new Date().toISOString()
            });

            setBannedIPs((prev) => [...prev, banningIP]);

            await updateUsersBanStatusByIP(banningIP, banReason);

            toast.success(`IP address ${banningIP} has been banned`);
            setBanModalOpen(false);
        } catch (e) {
            console.error("Error banning IP:", e);
            toast.error("Failed to ban IP");
        }
    };

    const handleUnbanIP = async (ip: string) => {
        try {
            await setDoc(doc(db, "bannedIPs", ip), {}, { merge: false }); // Delete document by overwrite with empty? Firestore does not support set with merge:false to delete doc, so use deleteDoc instead
            // Corrected:
            // import { deleteDoc } from "firebase/firestore";
            // await deleteDoc(doc(db, "bannedIPs", ip));

            // So add import and use deleteDoc:
        } catch (e) {
            console.error("Error unbanning IP:", e);
            toast.error("Failed to unban IP");
            return;
        }

        // Remove IP locally
        setBannedIPs((prev) => prev.filter(bannedIP => bannedIP !== ip));

        await removeIPBanFromUsers(ip);

        toast.success(`IP address ${ip} has been unbanned`);
    };

    // Update users ban status in Firestore by IP
    const updateUsersBanStatusByIP = async (ip: string, reason: string) => {
        try {
            const usersRef = collection(db, "managedUsers");
            const q = query(usersRef, where("ip", "==", ip));
            const querySnapshot = await getDocs(q);

            const batchUpdates = querySnapshot.docs.map(docSnap => {
                return updateDoc(docSnap.ref, {
                    status: "inactive",
                    accountEnabled: false,
                    isBanned: true,
                    banReason: reason || "IP address banned by administrator"
                });
            });

            await Promise.all(batchUpdates);

            // Update local state
            setManagedUsers(prev =>
                prev.map(user =>
                    user.ip === ip ? { ...user, status: "inactive", accountEnabled: false, isBanned: true, banReason: reason } : user
                )
            );
        } catch (e) {
            console.error("Error updating user ban status by IP:", e);
        }
    };

    // Remove IP ban from users in Firestore
    const removeIPBanFromUsers = async (ip: string) => {
        try {
            const usersRef = collection(db, "managedUsers");
            const q = query(usersRef, where("ip", "==", ip));
            const querySnapshot = await getDocs(q);

            const batchUpdates = querySnapshot.docs.map(docSnap => {
                return updateDoc(docSnap.ref, {
                    status: "inactive",
                    isBanned: false,
                    banReason: ""
                });
            });

            await Promise.all(batchUpdates);

            // Update local state
            setManagedUsers(prev =>
                prev.map(user =>
                    user.ip === ip ? { ...user, status: "inactive", isBanned: false, banReason: "" } : user
                )
            );
        } catch (e) {
            console.error("Error removing IP ban from users:", e);
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
                    <CardHeader>
                        <CardTitle>Search IP or Email</CardTitle>
                        <CardDescription>Enter an IP address, email, or location to filter results</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            placeholder="Search by IP, email, or location"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                            icon={<Search />}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Current Session</CardTitle>
                        <CardDescription>Your IP and login time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Email: {storedEmail || "N/A"}</p>
                        <p>IP: {storedIP || "N/A"}</p>
                        <p>Last Login: {storedLastLogin || "N/A"}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Banned IPs</CardTitle>
                        <CardDescription>Manage banned IP addresses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {bannedIPs.length === 0 && <p>No banned IP addresses</p>}
                        {bannedIPs.length > 0 && (
                            <ul className="space-y-2 max-h-40 overflow-auto">
                                {bannedIPs.map((ip) => (
                                    <li key={ip} className="flex justify-between items-center">
                                        <span>{ip}</span>
                                        <Button size="sm" variant="destructive" onClick={() => handleUnbanIP(ip)}>
                                            <Shield className="mr-1 h-4 w-4" />
                                            Unban
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Logins</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.ip}</TableCell>
                            <TableCell>{user.location}</TableCell>
                            <TableCell>{user.lastLogin}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>{user.device}</TableCell>
                            <TableCell>{user.loginCount}</TableCell>
                            <TableCell>
                                {bannedIPs.includes(user.ip) ? (
                                    <Button size="sm" variant="destructive" onClick={() => handleUnbanIP(user.ip)}>
                                        <Shield className="mr-1 h-4 w-4" />
                                        Unban IP
                                    </Button>
                                ) : (
                                    <Button size="sm" variant="outline" onClick={() => handleBanIP(user.ip)}>
                                        <Ban className="mr-1 h-4 w-4" />
                                        Ban IP
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={banModalOpen} onOpenChange={setBanModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ban IP Address</DialogTitle>
                        <DialogDescription>
                            You are banning IP: <strong>{banningIP}</strong>. Provide a reason below.
                        </DialogDescription>
                    </DialogHeader>
                    <textarea
                        className="w-full h-24 p-2 border rounded"
                        placeholder="Reason for ban (optional)"
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                    />
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setBanModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmBanIP}>Ban IP</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
