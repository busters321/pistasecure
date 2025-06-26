import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronDown, ChevronUp, User, Mail, BadgeDollarSign } from "lucide-react";

const ProfileSection = () => {
    const { user } = useAuth();
    const [expanded, setExpanded] = useState(false);

    if (!user) return null;

    return (
        <section className="mt-10">
            <Card className="transition-all">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-pistachio" />
                        <CardTitle className="text-xl">Your Profile</CardTitle>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-sm"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? "Hide Info" : "Show Info"}
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                </CardHeader>

                {expanded && (
                    <CardContent className="space-y-4 pt-2">
                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Email:</span>
                                <span>{user.email}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">User ID:</span>
                                <span className="truncate max-w-[200px]">{user.uid}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <BadgeDollarSign className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Plan:</span>
                                <span>Free</span>
                            </div>
                        </div>

                        <Button
                            variant="default"
                            className="bg-pistachio hover:bg-pistachio-dark text-black w-full"
                            onClick={() => window.location.href = "/billing"}
                        >
                            Upgrade Plan
                        </Button>
                    </CardContent>
                )}
            </Card>
        </section>
    );
};

export default ProfileSection;
