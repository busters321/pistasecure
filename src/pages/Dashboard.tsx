// src/pages/Dashboard.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Link, Mail, MessageCircle, Globe, Instagram, Key, FileText, BarChart3 } from "lucide-react";
import ProfileSection from "@/components/ui/ProfileSection";

const Dashboard = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    const features = [
        { icon: Shield, title: "AI Scam Intelligence", description: "Detect scams using text, links, or screenshots", path: "/scam-intelligence" },
        
        
        { icon: MessageCircle, title: "Cyber Copilot Chat", description: "Get AI security advice and answers", path: "/cyber-copilot" },
        
        { icon: Instagram, title: "Social Media Protection", description: "Detect fake profiles and scam accounts", path: "/social-protection" },
        
        { icon: FileText, title: "Scam Report Generator", description: "Create and send scam reports easily", path: "/scam-report" },
        { icon: BarChart3, title: "Live Threat Feed", description: "See real-time scam trends and alerts", path: "/threat-feed" },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome to PistaSecure</h1>
                    <p>Your digital security dashboard. Choose a tool to get started.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map(({ icon: Icon, title, description, path }, i) => (
                        <Card key={i} className="hover:shadow-md transition-all">
                            <CardHeader className="pb-2">
                                <div className="rounded-full w-10 h-10 mb-3 bg-pistachio/10 flex items-center justify-center">
                                    <Icon className="h-5 w-5 text-pistachio" />
                                </div>
                                <CardTitle className="text-lg">{title}</CardTitle>
                                <CardDescription>{description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full hover:bg-pistachio/10 hover:text-pistachio" onClick={() => navigate(path)}>
                                    Launch Tool
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <ProfileSection />
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
