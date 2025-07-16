import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { canAccessFeature } from "../lib/userFeatureAccess";
import { useState } from "react";
import {
    Wrench,
    Shield,
    Lock,
    Calendar,
    Clock,
    Mail,
    ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SocialMediaProtection() {
    const { subscription } = useAuth();
    const featureName = "socialMediaProtection";
    const allowed = canAccessFeature(subscription, featureName);
    const [showAlert, setShowAlert] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pistachio/10 mb-6">
                            <Shield className="h-10 w-10 text-pistachio" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Social Media Protection
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Advanced security for your social accounts against impersonation, scams, and privacy breaches
                        </p>
                    </div>

                    {/* Maintenance Banner */}
                    <Card className="border-pistachio/50 bg-gradient-to-r from-pistachio/5 to-background mb-12">
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-start gap-6">
                                <div className="bg-amber-100/20 border border-amber-300/50 rounded-full p-3 flex-shrink-0">
                                    <Wrench className="h-8 w-8 text-amber-500" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-amber-600 flex items-center gap-2 mb-2">
                                        Feature Under Maintenance
                                    </h2>
                                    <p className="text-muted-foreground mb-4">
                                        We're enhancing Social Media Protection with advanced security algorithms to better protect your accounts.
                                        This feature will be available again shortly with improved detection capabilities.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                            <Calendar className="h-5 w-5 text-pistachio" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Estimated Completion</p>
                                                <p className="font-medium">Unknown</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                            <Clock className="h-5 w-5 text-pistachio" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Current Status</p>
                                                <p className="font-medium">Final Testing Phase</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button
                                            variant="secondary"
                                            className="flex items-center gap-2"
                                            onClick={() => window.location.href = 'mailto:support@pistasecure.com'}
                                        >
                                            <Mail className="h-4 w-4" />
                                            Contact Support
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="border-pistachio text-pistachio hover:bg-pistachio/10"
                                            onClick={() => window.location.href = '/changelog'}
                                        >
                                            View Changelog
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Feature Preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
                        <Card className="border-pistachio/30 hover:border-pistachio/50 transition-colors">
                            <div className="p-6">
                                <div className="w-12 h-12 rounded-full bg-pistachio/10 flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-pistachio" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Impersonation Detection</h3>
                                <p className="text-muted-foreground mb-4">
                                    Real-time monitoring for fake profiles pretending to be you across all major platforms
                                </p>
                                <div className="text-pistachio flex items-center gap-1 text-sm font-medium">
                                    Coming in v2.1 <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </Card>

                        <Card className="border-pistachio/30 hover:border-pistachio/50 transition-colors">
                            <div className="p-6">
                                <div className="w-12 h-12 rounded-full bg-pistachio/10 flex items-center justify-center mb-4">
                                    <Lock className="h-6 w-6 text-pistachio" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Privacy Guardian</h3>
                                <p className="text-muted-foreground mb-4">
                                    Automatically detects and alerts you about overshared personal information
                                </p>
                                <div className="text-pistachio flex items-center gap-1 text-sm font-medium">
                                    Coming in v2.1 <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </Card>

                        <Card className="border-pistachio/30 hover:border-pistachio/50 transition-colors">
                            <div className="p-6">
                                <div className="w-12 h-12 rounded-full bg-pistachio/10 flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-pistachio" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Scam Prevention</h3>
                                <p className="text-muted-foreground mb-4">
                                    AI-powered analysis of messages to detect phishing and social engineering attempts
                                </p>
                                <div className="text-pistachio flex items-center gap-1 text-sm font-medium">
                                    Coming in v2.1 <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Upgrade CTA */}
                    <Card className="bg-gradient-to-r from-pistachio/5 to-background border-pistachio/30">
                        <div className="p-8 text-center">
                            <div className="flex justify-center mb-6">
                                <div className="rounded-full p-3 bg-pistachio/10">
                                    <Lock className="h-8 w-8 text-pistachio" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Pro Feature Access</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                                Social Media Protection is a premium security feature. Activate your subscription
                                to get early access when maintenance completes.
                            </p>
                            <Button
                                className="bg-pistachio hover:bg-pistachio-dark text-black"
                                onClick={() => window.location.href = '/billing'}
                            >
                                Upgrade to Pro
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}