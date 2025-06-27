// src/App.tsx

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { FeatureAccessProvider } from "./contexts/FeatureAccessContext";

// Pages
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ScamIntelligence from "./pages/ScamIntelligence";
import LinkInspection from "./pages/LinkInspection";
import EmailScanner from "./pages/EmailScanner";
import CyberCopilot from "./pages/CyberCopilot";
import SafeViewBrowser from "./pages/SafeViewBrowser";
import SocialMediaProtection from "./pages/SocialMediaProtection";
import PasswordChecker from "./pages/PasswordChecker";
import ScamReport from "./pages/ScamReport";
import ThreatFeed from "./pages/ThreatFeed";
import Billing from "./pages/Billing";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";

// Route protection
import PrivateRoute from "./components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <AuthProvider>
                        <AdminAuthProvider>
                            <FeatureAccessProvider>
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/" element={<Index />} />
                                    <Route path="/signup" element={<SignUp />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/how-it-works" element={<HowItWorks />} />

                                    {/* Protected Routes */}
                                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                                    <Route path="/scam-intelligence" element={<PrivateRoute><ScamIntelligence /></PrivateRoute>} />
                                    <Route path="/link-inspection" element={<PrivateRoute><LinkInspection /></PrivateRoute>} />
                                    <Route path="/email-scanner" element={<PrivateRoute><EmailScanner /></PrivateRoute>} />
                                    <Route path="/cyber-copilot" element={<PrivateRoute><CyberCopilot /></PrivateRoute>} />
                                    <Route path="/safe-view" element={<PrivateRoute><SafeViewBrowser /></PrivateRoute>} />
                                    <Route path="/social-protection" element={<PrivateRoute><SocialMediaProtection /></PrivateRoute>} />
                                    <Route path="/password-checker" element={<PrivateRoute><PasswordChecker /></PrivateRoute>} />
                                    <Route path="/scam-report" element={<PrivateRoute><ScamReport /></PrivateRoute>} />
                                    <Route path="/threat-feed" element={<PrivateRoute><ThreatFeed /></PrivateRoute>} />
                                    <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />

                                    {/* Admin Routes */}
                                    <Route path="/admin" element={<AdminLogin />} />
                                    <Route path="/admin/dashboard" element={<AdminDashboard />} />

                                    {/* Not Found */}
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </FeatureAccessProvider>
                        </AdminAuthProvider>
                    </AuthProvider>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;
