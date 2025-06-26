import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Shield, EyeOff, Eye, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { isAdminAuthenticated, adminLogin } = useAdminAuth();

    if (isAdminAuthenticated) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        adminLogin(email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="rounded-full p-3 bg-pistachio/10">
                            <Lock className="h-8 w-8 text-pistachio" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
                    <CardDescription className="text-center">
                        Enter your admin email and password to access the dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Admin Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pr-10"
                                    required
                                />
                                <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Admin Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pr-10"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
                        >
                            Access Admin Panel
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                            <Shield className="h-4 w-4 text-pistachio" />
                            <span className="text-sm text-muted-foreground">Secure Admin Access Portal</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogin;