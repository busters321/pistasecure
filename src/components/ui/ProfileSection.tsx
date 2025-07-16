import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronDown, ChevronUp, User, Mail, BadgeDollarSign, Crown, Zap, Sparkles, Loader } from "lucide-react";

const ProfileSection = () => {
    const { user } = useAuth();
    const [expanded, setExpanded] = useState(false);
    const [userPlan, setUserPlan] = useState("Free");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) return;

        const fetchSubscription = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await fetch(
                    `https://pistasecure-api.vercel.app/api/get-subscription?userId=${user.uid}`
                );

                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                setUserPlan(data?.plan === "pro" ? "Pro" : "Free");
            } catch (err) {
                console.error("Failed to fetch subscription:", err);
                setError(err.message || "Failed to load subscription data");
                setUserPlan("Free");
            } finally {
                setLoading(false);
            }
        };

        fetchSubscription();
    }, [user]);

    if (!user) return null;

    return (
        <section className="mt-10">
            <Card className="transition-all border-pistachio/30 bg-gradient-to-br from-background to-muted/5 shadow-lg">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-pistachio/10 p-2 rounded-full">
                            <User className="w-6 h-6 text-pistachio" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Your Profile</CardTitle>
                            <CardDescription>
                                Manage your account and subscription
                            </CardDescription>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-sm border-pistachio/50 text-pistachio hover:bg-pistachio/10"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? "Hide Info" : "Show Info"}
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                </CardHeader>

                {expanded && (
                    <CardContent className="space-y-4 pt-2">
                        <div className="border-t border-border/30 pt-4 space-y-4 text-sm">
                            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                <div className="bg-pistachio/10 p-2 rounded-full">
                                    <Mail className="w-4 h-4 text-pistachio" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                <div className="bg-pistachio/10 p-2 rounded-full">
                                    <User className="w-4 h-4 text-pistachio" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">User ID</p>
                                    <p className="font-medium truncate max-w-[200px]">{user.uid}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pistachio/5 to-background rounded-lg border border-pistachio/30">
                                <div className="bg-pistachio/10 p-2 rounded-full">
                                    <BadgeDollarSign className="w-4 h-4 text-pistachio" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Current Plan</p>
                                    <div className="flex items-center gap-2">
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader className="h-4 w-4 animate-spin text-pistachio" />
                                                <span className="text-muted-foreground">Loading...</span>
                                            </div>
                                        ) : error ? (
                                            <span className="text-red-500 text-sm">{error}</span>
                                        ) : (
                                            <>
                                                <span className={`font-bold ${userPlan === "Pro" ? "text-pistachio" : ""}`}>
                                                    {userPlan}
                                                </span>
                                                {userPlan === "Pro" && (
                                                    <span className="text-xs bg-pistachio/10 text-pistachio px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <Crown className="h-3 w-3" /> Active
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="default"
                            className="bg-gradient-to-r from-pistachio to-emerald-500 hover:from-pistachio-dark hover:to-emerald-600 text-white shadow-lg shadow-pistachio/20 w-full"
                            onClick={() => window.location.href = "/billing"}
                        >
                            <div className="flex items-center gap-2">
                                {userPlan === "Pro" ? (
                                    <>
                                        <Zap className="h-4 w-4" /> Manage Plan
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" /> Upgrade Plan
                                    </>
                                )}
                            </div>
                        </Button>
                    </CardContent>
                )}
            </Card>
        </section>
    );
};

export default ProfileSection;