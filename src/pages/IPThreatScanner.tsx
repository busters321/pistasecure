import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock, Shield } from "lucide-react";
import { Header } from "@/components/Header"; // Import Header
import { Footer } from "@/components/Footer"; // Import Footer

const IpThreatScanner = () => {
    const { isActive } = useAuth();
    const navigate = useNavigate();

    if (!isActive) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header /> {/* Added Header here */}
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="rounded-full p-2 bg-pistachio/10">
                                <Shield className="h-6 w-6 text-pistachio" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">IP Threat Scanner</h1>
                                <p className="text-muted-foreground">
                                    Advanced IP threat intelligence
                                </p>
                            </div>
                        </div>

                        <Card className="p-8 text-center">
                            <div className="flex flex-col items-center space-y-4">
                                <Lock className="h-10 w-10 text-pistachio" />
                                <h2 className="text-2xl font-semibold">Pro Feature Locked</h2>
                                <p className="text-muted-foreground max-w-md">
                                    IP Threat Scanner is a premium security tool that identifies malicious IP addresses
                                    and potential network threats. Activate your subscription to use it.
                                </p>
                                <Button
                                    className="bg-pistachio text-black hover:bg-pistachio-dark"
                                    onClick={() => navigate("/billing")}
                                >
                                    Go to Billing
                                </Button>
                            </div>
                        </Card>
                    </div>
                </main>
                <Footer /> {/* Added Footer here */}
            </div>
        );
    }

    // ... rest of the component code remains unchanged ...
    const [ip, setIp] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const { toast } = useToast();

    const isValidIP = (ip: string) => {
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4Regex.test(ip) || ipv6Regex.test(ip);
    };

    const fetchThreatData = async () => {
        if (!isValidIP(ip)) {
            toast({
                title: "Invalid IP",
                description: "Please enter a valid IPv4 or IPv6 address",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('https://pistasecure-api.vercel.app/api/ip-threat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ipAddress: ip })
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Received non-JSON response:', text);
                throw new Error('Invalid response from server');
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Scan failed');
            }

            const data = await response.json();

            if (!data?.data || typeof data.data.abuseConfidenceScore !== 'number') {
                console.error('Invalid response structure:', data);
                throw new Error("Invalid response from threat intelligence service");
            }

            setResult(data.data);
            toast({
                title: "Success",
                description: "IP scanned successfully",
                duration: 3000
            });

        } catch (error) {
            console.error("Scan failed:", error);
            toast({
                title: "Scan failed",
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: "destructive",
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center px-4">
                    <Button variant="ghost" size="icon" className="mr-4">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-pistachio"
                                fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-xl font-bold">
                                Pista<span className="text-pistachio">Secure</span>
                            </span>
                        </div>
                    </Button>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">
                            IP Threat Scanner
                        </CardTitle>
                        <CardDescription className="text-center">
                            Check any IP address for malicious activity
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="flex w-full items-center space-x-2 mb-6">
                            <Input
                                type="text"
                                placeholder="Enter IP address (e.g., 8.8.8.8 or 2001:db8::)"
                                value={ip}
                                onChange={(e) => setIp(e.target.value)}
                                className="flex-1"
                                disabled={loading}
                                onKeyDown={(e) => e.key === 'Enter' && fetchThreatData()}
                            />
                            <Button
                                onClick={fetchThreatData}
                                className="bg-pistachio hover:bg-pistachio-dark text-black"
                                disabled={loading || !ip.trim()}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                                            xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10"
                                                stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                        Scanning...
                                    </>
                                ) : "Scan"}
                            </Button>
                        </div>

                        {result && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">IP Address</h3>
                                        <p className="text-sm font-mono">{result.ipAddress}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">IP Version</h3>
                                        <p className="text-sm">IPv{result.ipVersion}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">ISP</h3>
                                        <p className="text-sm">{result.isp || "N/A"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Country</h3>
                                        <p className="text-sm">{result.countryName || "N/A"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Usage Type</h3>
                                        <p className="text-sm">{result.usageType || "N/A"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Abuse Score</h3>
                                        <p className="text-sm">
                                            <span className={`font-bold ${result.abuseConfidenceScore > 70 ? 'text-red-500' :
                                                result.abuseConfidenceScore > 30 ? 'text-amber-500' : 'text-pistachio'
                                                }`}>
                                                {result.abuseConfidenceScore}/100
                                            </span>
                                            {result.isWhitelisted && <span className="ml-2 text-xs text-green-500">(Whitelisted)</span>}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Domain</h3>
                                        <p className="text-sm">{result.domain || "N/A"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Hostnames</h3>
                                        <p className="text-sm">{result.hostnames?.join(', ') || "N/A"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Is Public</h3>
                                        <p className="text-sm">{result.isPublic ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Is Tor</h3>
                                        <p className="text-sm">{result.isTor ? "Yes" : "No"}</p>
                                    </div>
                                </div>

                                <div className="border-t border-border/40 pt-4 mt-4">
                                    <h3 className="text-lg font-semibold mb-3">Threat Reports (Last 90 Days)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-muted-foreground">Total Reports</h3>
                                            <p className="text-sm">{result.totalReports}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-muted-foreground">Distinct Users</h3>
                                            <p className="text-sm">{result.numDistinctUsers}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-muted-foreground">Last Reported</h3>
                                            <p className="text-sm">
                                                {result.lastReportedAt ?
                                                    new Date(result.lastReportedAt).toLocaleString() :
                                                    "N/A"
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {result.reports && result.reports.length > 0 && (
                                        <div className="mt-4">
                                            <h3 className="text-sm font-medium mb-2">Recent Reports:</h3>
                                            <div className="space-y-3">
                                                {result.reports.slice(0, 5).map((report: any, index: number) => (
                                                    <div key={index} className="p-3 bg-muted/50 rounded-md">
                                                        <p className="text-sm font-medium">
                                                            {new Date(report.reportedAt).toLocaleString()}
                                                        </p>
                                                        <p className="text-sm mt-1">{report.comment}</p>
                                                        <p className="text-xs mt-1 text-muted-foreground">
                                                            Reporter: {report.reporterCountryName} (ID: {report.reporterId})
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default IpThreatScanner;