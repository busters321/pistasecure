
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SignUpFormProps {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    agreeToTerms: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    agreeToTerms: boolean;
  }>>;
  onSubmit: () => void;
}

export function SignUpForm({ formData, setFormData, onSubmit }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Get existing users or create empty array
      const storedUsers = localStorage.getItem("pistaSecure_users");
      const existingUsers = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Add new user to array
      const newUser = {
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        joinDate: new Date().toISOString(),
        ip: "192.168." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255)
      };
      
      existingUsers.push(newUser);
      
      // Save updated users array
      localStorage.setItem("pistaSecure_users", JSON.stringify(existingUsers));
      
      // Set current user in localStorage
      localStorage.setItem("pistaSecure_userEmail", formData.email);
      localStorage.setItem("pistaSecure_userName", formData.name);
      localStorage.setItem("pistaSecure_lastLogin", new Date().toISOString());
      localStorage.setItem("pistaSecure_userIP", newUser.ip);
      
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
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
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="agreeToTerms" 
          name="agreeToTerms"
          checked={formData.agreeToTerms} 
          onCheckedChange={(checked) => 
            setFormData({...formData, agreeToTerms: checked === true})
          } 
        />
        <label
          htmlFor="agreeToTerms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the terms of service and privacy policy
        </label>
      </div>
      {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}
      
      <Button 
        type="submit" 
        className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
      >
        Create Account
      </Button>
      
      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="text-pistachio hover:underline">Log in</a>
      </p>
    </form>
  );
}
