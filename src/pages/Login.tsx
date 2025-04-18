
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // Get registered users from localStorage
    const storedUsers = localStorage.getItem("pistaSecure_users");
    if (!storedUsers) {
      toast({
        title: "Error",
        description: "No registered users found",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user exists with matching credentials
      const users = JSON.parse(storedUsers);
      const managed = JSON.parse(localStorage.getItem("pistaSecure_managedUsers") || "[]");

      const user = users.find((u: any) =>
          u.email === formData.email && u.password === formData.password
      );

      if (!user) {
          toast({
              title: "Error",
              description: "Invalid email or password",
              variant: "destructive",
          });
          return;
      }

      const managedUser = managed.find((m: any) => m.email === formData.email);
      if (managedUser && managedUser.accountEnabled === false) {
          toast({
              title: "Account Deactivated",
              description: "Your account has been deactivated by an administrator.",
              variant: "destructive",
          });
          return;
      }

    
    // Login successful
    localStorage.setItem("pistaSecure_isLoggedIn", "true");
    localStorage.setItem("pistaSecure_userEmail", formData.email);
    localStorage.setItem("pistaSecure_lastLogin", new Date().toISOString());
    localStorage.setItem("pistaSecure_userIP", "192.168." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255));
    
    toast({
      title: "Success",
      description: "You have been logged in successfully",
    });
    
    navigate("/dashboard");
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
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
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
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
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
              
              <Button 
                type="submit" 
                className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
              >
                Log in
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account yet? <Link to="/signup" className="text-pistachio hover:underline">Sign up</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
