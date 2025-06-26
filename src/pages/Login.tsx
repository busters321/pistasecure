import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Login = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        const auth = getAuth();
        const db = getFirestore();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const uid = userCredential.user.uid;

            const userDoc = await getDoc(doc(db, "users", uid));
            if (!userDoc.exists()) throw new Error("User not found");

            const userData = userDoc.data();
            if (userData.status === "disabled" || userData.status === "banned") {
                toast({
                    title: "Account Disabled",
                    description: "Your account has been disabled. Contact support for help.",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Success",
                description: "You have been logged in successfully",
            });

            navigate("/dashboard");
        } catch {
            toast({
                title: "Error",
                description: "Invalid email or password",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center px-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="mr-4">
                        <Link to="/" className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-pistachio" />
                            <span className="text-xl font-bold">
                                Pista<span className="text-pistachio">Secure</span>
                            </span>
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Log in to PistaSecure</CardTitle>
                        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">Password</label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
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

                            <Button type="submit" className="w-full bg-pistachio hover:bg-pistachio-dark text-black">
                                Log in
                            </Button>

                            <p className="text-center text-sm text-muted-foreground">
                                Don't have an account yet?{" "}
                                <Link to="/signup" className="text-pistachio hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
