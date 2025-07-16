import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
    BadgeDollarSign,
    Zap,
    CheckCircle,
    Crown,
    Shield,
    Gem,
    ArrowRight,
    Sparkles,
    Loader
} from "lucide-react";

const Billing = () => {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            fetchUserSubscription(user.uid);
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchUserSubscription = async (uid: string) => {
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(
                `https://pistasecure-api.vercel.app/api/get-subscription?userId=${uid}`
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setSubscription(data);
        } catch (err) {
            console.error("Failed to fetch subscription:", err);
            setError(err.message || "Failed to load subscription data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpgradeClick = async () => {
        if (!user) {
            alert("Please sign in first");
            return;
        }

        setIsUpgrading(true);
        try {
            const response = await fetch(
                "https://pistasecure-api.vercel.app/api/create-checkout-session",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        priceId: "price_1RlaBkK1Xz4Wkq9iuHdkdRr4",
                        userId: user.uid
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create checkout session');
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Missing checkout URL");
            }
        } catch (err: any) {
            console.error("Upgrade failed:", err);
            alert("Error: " + (err.message || "Something went wrong"));
        } finally {
            setIsUpgrading(false);
        }
    };

    const PlanCard = ({
        title,
        price,
        description,
        features,
        isPro,
        isCurrent
    }) => (
        <div className={`border rounded-xl overflow-hidden transition-all ${isPro
                ? "border-pistachio/70 bg-gradient-to-b from-pistachio/5 to-background shadow-lg shadow-pistachio/10"
                : "border-border"
            }`}>
            <div className={`p-5 ${isPro ? "bg-pistachio/10" : "bg-muted/10"}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            {isPro && <Crown className="h-5 w-5 text-pistachio" />}
                            {title}
                        </h3>
                        <p className="text-muted-foreground">{description}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">{price}</p>
                        <p className="text-sm text-muted-foreground">per month</p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <ul className="space-y-3 mb-6">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-pistachio flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                {isPro ? (
                    <Button
                        className={`w-full ${isCurrent
                                ? "bg-muted text-foreground cursor-default"
                                : "bg-gradient-to-r from-pistachio to-emerald-500 hover:from-pistachio-dark hover:to-emerald-600 text-white shadow-lg shadow-pistachio/20"
                            }`}
                        onClick={isCurrent ? undefined : handleUpgradeClick}
                        disabled={isUpgrading}
                    >
                        {isCurrent ? (
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" /> Current Plan
                            </div>
                        ) : isUpgrading ? (
                            <div className="flex items-center gap-2">
                                <Loader className="h-4 w-4 animate-spin" /> Processing...
                            </div>
                        ) : (
                            "Upgrade to Pro"
                        )}
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        className="w-full border-pistachio/50 text-pistachio hover:bg-pistachio/10"
                        disabled={isCurrent || isUpgrading}
                    >
                        {isCurrent ? "Current Plan" : "Downgrade"}
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/10">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pistachio/10 mb-4">
                        <BadgeDollarSign className="h-8 w-8 text-pistachio" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Subscription Plans</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that fits your security needs and unlock premium features
                    </p>
                </div>

                <Card className="border-pistachio/30 bg-gradient-to-r from-pistachio/5 to-background shadow-lg mb-12">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <Crown className="h-6 w-6 text-pistachio" />
                            <CardTitle>Your Current Subscription</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your billing information and payment methods
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!user ? (
                            <div className="text-center py-6">
                                <p className="text-muted-foreground mb-4">Please sign in to view your subscription</p>
                                <Button
                                    className="bg-pistachio hover:bg-pistachio-dark text-black"
                                    onClick={() => window.location.href = "/login"}
                                >
                                    Sign In
                                </Button>
                            </div>
                        ) : isLoading ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="flex gap-1 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-pistachio animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-pistachio animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                    <div className="w-2 h-2 rounded-full bg-pistachio animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                </div>
                                <p className="text-muted-foreground">Loading subscription status...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-6">
                                <p className="text-red-500 mb-4">{error}</p>
                                <Button
                                    className="bg-pistachio hover:bg-pistachio-dark text-black"
                                    onClick={() => fetchUserSubscription(user.uid)}
                                >
                                    Retry
                                </Button>
                            </div>
                        ) : subscription ? (
                            <div className="bg-gradient-to-r from-pistachio/5 to-background p-5 rounded-lg border border-pistachio/30">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            {subscription.plan === "pro" ? (
                                                <>
                                                    <Crown className="h-5 w-5 text-pistachio" />
                                                    Pro Plan
                                                </>
                                            ) : "Free Plan"}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${subscription.status === "active"
                                                    ? "bg-pistachio/10 text-pistachio"
                                                    : "bg-muted text-foreground"
                                                }`}>
                                                <Shield className="h-3 w-3" />
                                                {subscription.status === "active" ? "Active" : "Inactive"}
                                            </span>
                                            {subscription.status === "active" && subscription.currentPeriodEnd?.seconds && (
                                                <span className="text-xs bg-muted text-foreground px-2 py-1 rounded-full">
                                                    Renews on: {new Date(subscription.currentPeriodEnd.seconds * 1000).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-muted-foreground mb-4">No active subscription found</p>
                                <Button
                                    className="bg-pistachio hover:bg-pistachio-dark text-black"
                                    onClick={handleUpgradeClick}
                                    disabled={isUpgrading}
                                >
                                    {isUpgrading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader className="h-4 w-4 animate-spin" /> Processing...
                                        </div>
                                    ) : (
                                        "Get Started"
                                    )}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PlanCard
                        title="Free Plan"
                        price="$0"
                        description="Essential security features"
                        isPro={false}
                        isCurrent={subscription?.plan === "free"}
                        features={[
                            "Basic threat scanning",
                            "Limited daily scans",
                            "Email notifications",
                            "Community support"
                        ]}
                    />

                    <PlanCard
                        title="Pro Plan"
                        price="$9.99"
                        description="Advanced security suite"
                        isPro={true}
                        isCurrent={subscription?.plan === "pro" && subscription?.status === "active"}
                        features={[
                            "Unlimited threat scanning",
                            "Real-time monitoring",
                            "Priority customer support",
                            "AI-powered threat detection",
                            "Advanced reporting",
                            "Multi-device protection"
                        ]}
                    />
                </div>

                <div className="mt-12 bg-gradient-to-r from-pistachio/5 to-background border border-pistachio/30 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="bg-pistachio/10 p-4 rounded-full">
                            <Gem className="h-10 w-10 text-pistachio" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">Premium Security Experience</h3>
                            <p className="text-muted-foreground mb-4">
                                Pro users get exclusive access to advanced security tools and priority support.
                                Upgrade today for complete peace of mind.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Sparkles className="h-4 w-4 text-pistachio" />
                                    <span>AI Threat Detection</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Zap className="h-4 w-4 text-pistachio" />
                                    <span>Real-time Protection</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Shield className="h-4 w-4 text-pistachio" />
                                    <span>24/7 Priority Support</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            className="bg-gradient-to-r from-pistachio to-emerald-500 hover:from-pistachio-dark hover:to-emerald-600 text-white shadow-lg shadow-pistachio/20 whitespace-nowrap"
                            onClick={handleUpgradeClick}
                            disabled={isUpgrading}
                        >
                            {isUpgrading ? (
                                <div className="flex items-center gap-2">
                                    <Loader className="h-4 w-4 animate-spin" /> Processing...
                                </div>
                            ) : (
                                <>
                                    Upgrade to Pro <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Billing;