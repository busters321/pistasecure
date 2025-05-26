import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
    Shield,
    Users,
    BarChart3,
    Settings,
    Bell,
    LogOut,
    Menu,
    X,
    User,
    Link,
    Mail,
    Database,
    Globe,
    AlertTriangle,
    FileText,
    Instagram,
    Key,
    MessageCircle,
    MapPin,
    Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminStats } from "@/components/admin/AdminStats";
import AdminUsersList from "@/components/admin/AdminUsersList";
import { AdminScamStats } from "@/components/admin/AdminScamStats";
import { AdminSystemSettings } from "@/components/admin/AdminSystemSettings";
import { AdminUserIPTracker } from "@/components/admin/AdminUserIPTracker";
import { AdminToolsManagement } from "@/components/admin/AdminToolsManagement";

interface AdminToolsManagementProps {
    activeToolTab: string | null;
}

const AdminDashboard = () => {
    const { isAdminAuthenticated, adminLogout } = useAdminAuth();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeToolTab, setActiveToolTab] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Checking for admin notifications...");
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    if (!isAdminAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    const handleLogout = () => {
        adminLogout();
        navigate("/admin");
    };

    const handleToolClick = (tool: string) => {
        setActiveTab("tools");
        setActiveToolTab(tool);
    };

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <AdminStats />;
            case "security":
                return <AdminSecurityDashboard />;
            case "users":
                return <AdminUsersList />;
            case "scams":
                return <AdminScamStats />;
            case "settings":
                return <AdminSystemSettings />;
            case "ip-tracker":
                return <AdminUserIPTracker />;
            case "tools":
                return <AdminToolsManagement activeToolTab={activeToolTab} />;
            default:
                return <AdminStats />;
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 text-dark-100 flex">
            {/* Mobile Sidebar Toggle */}
            <Button
                variant="outline"
                size="icon"
                className="fixed bottom-4 right-4 z-40 rounded-full shadow-lg md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X className="h-5 w-5 text-pistachio" /> : <Menu className="h-5 w-5 text-pistachio" />}
            </Button>

            {/* Sidebar */}
            <div className={`
                bg-dark-800 border-r border-dark-700 w-64 fixed h-full transition-all duration-300 ease-in-out z-30
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
            `}>
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Shield className="h-6 w-6 text-pistachio" />
                        <span className="text-xl font-bold text-dark-100">Admin Panel</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5 text-pistachio" />
                    </Button>
                </div>

                <div className="p-4">
                    <nav className="space-y-6">
                        <div>
                            <h4 className="text-xs uppercase tracking-wider text-dark-400 font-semibold mb-2">Overview</h4>
                            <div className="space-y-1">
                                <Button
                                    variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                                    className="w-full justify-start text-dark-100"
                                    onClick={() => setActiveTab("dashboard")}
                                >
                                    <BarChart3 className="h-4 w-4 mr-2 text-pistachio" />
                                    Dashboard
                                </Button>
                                <Button
                                    variant={activeTab === "security" ? "secondary" : "ghost"}
                                    className="w-full justify-start text-dark-100"
                                    onClick={() => setActiveTab("security")}
                                >
                                    <Shield className="h-4 w-4 mr-2 text-pistachio" />
                                    Security
                                </Button>
                                <Button
                                    variant={activeTab === "users" ? "secondary" : "ghost"}
                                    className="w-full justify-start text-dark-100"
                                    onClick={() => setActiveTab("users")}
                                >
                                    <Users className="h-4 w-4 mr-2 text-pistachio" />
                                    Users
                                </Button>
                                <Button
                                    variant={activeTab === "ip-tracker" ? "secondary" : "ghost"}
                                    className="w-full justify-start text-dark-100"
                                    onClick={() => setActiveTab("ip-tracker")}
                                >
                                    <MapPin className="h-4 w-4 mr-2 text-pistachio" />
                                    IP Tracker
                                </Button>
                                <Button
                                    variant={activeTab === "scams" ? "secondary" : "ghost"}
                                    className="w-full justify-start text-dark-100"
                                    onClick={() => setActiveTab("scams")}
                                >
                                    <AlertTriangle className="h-4 w-4 mr-2 text-pistachio" />
                                    Scam Reports
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs uppercase tracking-wider text-dark-400 font-semibold mb-2">Tools Management</h4>
                            <div className="space-y-1">
                                <Button
                                    variant={(activeTab === "tools" && !activeToolTab) ? "secondary" : "ghost"}
                                    className="w-full justify-start text-dark-100 text-sm"
                                    onClick={() => {
                                        setActiveTab("tools");
                                        setActiveToolTab(null);
                                    }}
                                >
                                    <Settings2 className="h-4 w-4 mr-2 text-pistachio" />
                                    All Tools
                                </Button>
                                <Button
                                    variant={(activeTab === "tools" && activeToolTab === "scamIntelligence") ? "secondary" : "ghost"}
                                    className="w-full justify-start text-dark-100 text-sm"
                                    onClick={() => handleToolClick("scamIntelligence")}
                                >
                                    <Shield className="h-4 w-4 mr-2 text-pistachio" />
                                    Scam Intelligence
                                </Button>
                                <Button
                                    variant={(activeTab === "tools" && activeToolTab === "linkInspection") ? "secondary" : "ghost"}
                                    className="w-full justify-start text-dark-100 text-sm"
                                    onClick={() => handleToolClick("linkInspection")}
                                >
                                    <Link className="h-4 w-4 mr-2 text-pistachio" />
                                    Link Inspection
                                </Button>
                                <Button
                                    variant={(activeTab === "tools" && activeToolTab === "emailScanner") ? "secondary" : "ghost"}
                                    className="w-full justify-start text-dark-100 text-sm"
                                    onClick={() => handleToolClick("emailScanner")}
                                >
                                    <Mail className="h-4 w-4 mr-2 text-pistachio" />
                                    Email Scanner
                                </Button>
                                <Button
                                    variant={(activeTab === "tools" && activeToolTab === "cyberCopilot") ? "secondary" : "ghost"}
                                    className="w-full justify-start text-dark-100 text-sm"
                                    onClick={() => handleToolClick("cyberCopilot")}
                                >
                                    <MessageCircle className="h-4 w-4 mr-2 text-pistachio" />
                                    Cyber Copilot
                                </Button>
                                <Button
                                    variant={(activeTab === "tools" && activeToolTab === "safeView") ? "secondary" : "ghost"}
                                    className="w-full justify-start text-dark-100 text-sm"
                                    onClick={() => handleToolClick("safeView")}
                                >
                                    <Globe className="h-4 w-4 mr-2 text-pistachio" />
                                    SafeView Browser
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs uppercase tracking-wider text-dark-400 font-semibold mb-2">Admin</h4>
                            <div className="space-y-1">
                                <Button
                                    variant={activeTab === "settings" ? "secondary" : "ghost"}
                                    className="w-full justify-start text-dark-100"
                                    onClick={() => setActiveTab("settings")}
                                >
                                    <Settings className="h-4 w-4 mr-2 text-pistachio" />
                                    Settings
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-dark-100"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4 mr-2 text-pistachio" />
                                    Log out
                                </Button>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : ""}`}>
                <header className="bg-dark-800 border-b border-dark-700 p-4 flex justify-between items-center sticky top-0 z-20">
                    <h1 className="text-xl font-semibold text-dark-100">
                        {activeTab === "dashboard" && "Admin Dashboard"}
                        {activeTab === "security" && "Security Dashboard"}
                        {activeTab === "users" && "User Management"}
                        {activeTab === "scams" && "Scam Reports"}
                        {activeTab === "settings" && "System Settings"}
                        {activeTab === "ip-tracker" && "User IP Tracker"}
                        {activeTab === "tools" && (
                            <>Tools Management {activeToolTab && `- ${activeToolTab.replace(/([A-Z])/g, ' $1').trim()}`}</>
                        )}
                    </h1>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5 text-pistachio" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5 text-pistachio" />
                        </Button>
                    </div>
                </header>

                <div className="p-4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

// Add Security Dashboard Component
const AdminSecurityDashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Security Overview Card */}
            <Card className="border-dark-700">
                <CardHeader>
                    <CardTitle>Real-Time Monitoring</CardTitle>
                    <CardDescription>Live security events tracking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span>Active Threats</span>
                        <span className="text-pistachio font-bold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Blocked Requests</span>
                        <span className="text-pistachio font-bold">1.2k</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Suspicious Logins</span>
                        <span className="text-danger font-bold">3</span>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card className="border-dark-700">
                <CardHeader>
                    <CardTitle>Recent Security Events</CardTitle>
                    <CardDescription>Last 24 hours activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {[
                        { time: "10:32 AM", type: "Brute Force Attempt", ip: "192.168.1.15" },
                        { time: "09:45 AM", type: "SQL Injection", ip: "10.0.0.22" },
                        { time: "08:12 AM", type: "XSS Attempt", ip: "172.16.0.5" }
                    ].map((event, index) => (
                        <div key={index} className="flex justify-between items-center text-sm p-2 hover:bg-dark-800 rounded">
                            <div className="flex flex-col">
                                <span className="font-medium">{event.type}</span>
                                <span className="text-dark-400 text-xs">{event.ip}</span>
                            </div>
                            <span className="text-dark-400 text-xs">{event.time}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Firewall Status Card */}
            <Card className="border-dark-700">
                <CardHeader>
                    <CardTitle>Firewall Status</CardTitle>
                    <CardDescription>Network protection overview</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span>Total Blocked IPs</span>
                            <span className="text-pistachio font-bold">245</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Malicious Packets</span>
                            <span className="text-danger font-bold">42</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Active Rules</span>
                            <span className="text-pistachio font-bold">18</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* User Activity Card */}
            <Card className="border-dark-700 col-span-full">
                <CardHeader>
                    <CardTitle>User Activity Log</CardTitle>
                    <CardDescription>Recent user actions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[
                            { user: "admin", action: "Modified security settings", time: "2 mins ago" },
                            { user: "john_doe", action: "Accessed sensitive data", time: "15 mins ago" },
                            { user: "system", action: "Performed security scan", time: "30 mins ago" }
                        ].map((log, index) => (
                            <div key={index} className="flex justify-between items-center p-2 hover:bg-dark-800 rounded">
                                <div>
                                    <span className="font-medium">{log.user}</span>
                                    <span className="text-dark-400 ml-2">{log.action}</span>
                                </div>
                                <span className="text-dark-400 text-sm">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;