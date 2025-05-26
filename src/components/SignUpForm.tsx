import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import axios from "axios";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });

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
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one number";
        } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one special character";
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

    const getClientIP = async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            return response.data.ip;
        } catch (error) {
            console.error("Could not fetch IP:", error);
            return "192.168." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const userIP = await getClientIP();
            const userAgent = navigator.userAgent;
            const signupDate = new Date().toISOString();

            // Send data to your backend API
            const response = await axios.post('/api/auth/signup', {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                ipAddress: userIP,
                userAgent,
                signupDate,
                agreedToTerms: formData.agreeToTerms
            });

            // Store minimal auth data in localStorage
            localStorage.setItem("authToken", response.data.token);
            localStorage.setItem("userEmail", formData.email);
            localStorage.setItem("userName", formData.name);
            localStorage.setItem("lastLogin", signupDate);

            // Log the signup event to your security system
            await axios.post('/api/security/logs', {
                eventType: 'SIGNUP',
                userEmail: formData.email,
                ipAddress: userIP,
                userAgent,
                timestamp: signupDate,
                metadata: {
                    signupMethod: 'email'
                }
            });

            onSubmit();
        } catch (error) {
            console.error("Signup failed:", error);
            setErrors({
                ...errors,
                submit: error.response?.data?.message || "Signup failed. Please try again."
            });
        } finally {
            setIsSubmitting(false);
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                        placeholder="Create a password (min 8 chars)"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
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
                    disabled={isSubmitting}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                        setFormData({ ...formData, agreeToTerms: checked === true })
                    }
                    disabled={isSubmitting}
                />
                <label
                    htmlFor="agreeToTerms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    I agree to the terms of service and privacy policy
                </label>
            </div>
            {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}

            {errors.submit && <p className="text-sm text-destructive text-center">{errors.submit}</p>}

            <Button
                type="submit"
                className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <a
                    href="/login"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/login');
                    }}
                    className="text-pistachio hover:underline"
                >
                    Log in
                </a>
            </p>
        </form>
    );
}