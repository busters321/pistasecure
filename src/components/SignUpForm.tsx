import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/components/ui/firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { auth } from "@/components/ui/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

interface SignUpFormProps {
    formData: {
        email: string;
        password: string;
        confirmPassword: string;
        name: string;
        agreeToTerms: boolean;
    };
    setFormData: React.Dispatch<
        React.SetStateAction<{
            email: string;
            password: string;
            confirmPassword: string;
            name: string;
            agreeToTerms: boolean;
        }>
    >;
    onSubmit: () => void;
}

export function SignUpForm({ formData, setFormData, onSubmit }: SignUpFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";

        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email address is invalid";

        if (!formData.password) newErrors.password = "Password is required";
        else {
            if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
            else if (!/[A-Z]/.test(formData.password))
                newErrors.password = "Password must contain at least one uppercase letter";
            else if (!/[0-9]/.test(formData.password))
                newErrors.password = "Password must contain at least one number";
            else if (!/[^A-Za-z0-9]/.test(formData.password))
                newErrors.password = "Password must contain at least one special character";
        }

        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords don't match";

        if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getClientIP = async () => {
        try {
            const response = await fetch("https://api.ipify.org?format=json");
            const data = await response.json();
            return data.ip;
        } catch {
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
            const signupDate = new Date();

            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: formData.name });

            // Save user data to Firestore under 'users' collection
            await setDoc(doc(db, "users", user.uid), {
                name: formData.name,
                email: formData.email,
                status: "active",
                account: "user",
                ipAddress: userIP,
                joined: serverTimestamp(),
            });

            localStorage.setItem("userEmail", formData.email);
            localStorage.setItem("userName", formData.name);
            localStorage.setItem("lastLogin", signupDate.toISOString());

            await fetch("/api/security/logs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventType: "SIGNUP",
                    userEmail: formData.email,
                    ipAddress: userIP,
                    userAgent,
                    timestamp: signupDate.toISOString(),
                    metadata: {
                        signupMethod: "firebase",
                        uid: user.uid,
                    },
                }),
            });

            onSubmit();
        } catch (error: any) {
            setErrors({
                submit: error.message || "Signup failed. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                />
                {errors.name && <p className="text-red-600">{errors.name}</p>}
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                />
                {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>

            <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                </div>
                {errors.password && <p className="text-red-600">{errors.password}</p>}
            </div>

            <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                />
                {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => {
                        setFormData((prev) => ({
                            ...prev,
                            agreeToTerms: checked === true,
                        }));
                        if (errors.agreeToTerms) {
                            setErrors((prev) => ({
                                ...prev,
                                agreeToTerms: "",
                            }));
                        }
                    }}
                    disabled={isSubmitting}
                    required
                />
                <Label htmlFor="agreeToTerms">I agree to the terms and conditions</Label>
            </div>
            {errors.agreeToTerms && <p className="text-red-600">{errors.agreeToTerms}</p>}

            {errors.submit && <p className="text-red-600">{errors.submit}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
        </form>
    );
}
