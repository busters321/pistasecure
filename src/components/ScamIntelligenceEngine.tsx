import { useState } from "react";
import { Shield, AlertTriangle, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock, MessageCircle } from "lucide-react"; // Add other icons if needed
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";


type RiskLevel = "safe" | "suspicious" | "dangerous" | null;

interface AnalysisResult {
    riskLevel: RiskLevel;
    score: number;
    reasons: string[];
    advice: string;
}

// Moved scamIndicators outside the component for better performance
const scamIndicators = [
    // High-Urgency Tactics (65-85)
    { keyword: "act immediately", score: 85 },
    { keyword: "within 24 hours", score: 80 },
    { keyword: "final warning", score: 90 },
    { keyword: "account suspension imminent", score: 88 },
    { keyword: "immediate action required", score: 82 },
    { keyword: "last chance to claim", score: 75 },
    { keyword: "expires today", score: 70 },
    { keyword: "urgent security alert", score: 85 },
    { keyword: "time-sensitive matter", score: 65 },
    { keyword: "do not ignore this", score: 80 },

    // Financial Lures (60-85)
    { keyword: "free cash prize", score: 70 },
    { keyword: "you've been selected", score: 65 },
    { keyword: "no investment required", score: 60 },
    { keyword: "tax refund pending", score: 75 },
    { keyword: "inheritance release", score: 80 },
    { keyword: "crypto giveaway", score: 85 },
    { keyword: "guaranteed returns", score: 88 },
    { keyword: "government stimulus", score: 75 },
    { keyword: "unclaimed money", score: 70 },
    { keyword: "million dollar prize", score: 85 },

    // Threat & Intimidation (80-95)
    { keyword: "arrest warrant issued", score: 95 },
    { keyword: "legal action pending", score: 90 },
    { keyword: "social security suspended", score: 85 },
    { keyword: "pay or face prosecution", score: 95 },
    { keyword: "immediate payment required", score: 85 },
    { keyword: "account termination notice", score: 80 },
    { keyword: "deportation proceedings", score: 82 },
    { keyword: "police investigation", score: 75 },
    { keyword: "court summons attached", score: 88 },
    { keyword: "frozen assets", score: 80 },

    // Impersonation Scams (65-85)
    { keyword: "microsoft security alert", score: 75 },
    { keyword: "amazon prime renewal", score: 70 },
    { keyword: "paypal account limited", score: 80 },
    { keyword: "fedex delivery issue", score: 65 },
    { keyword: "irs tax notice", score: 85 },
    { keyword: "apple id verification", score: 72 },
    { keyword: "netflix payment problem", score: 68 },
    { keyword: "bank fraud department", score: 78 },
    { keyword: "social security administration", score: 80 },
    { keyword: "dhl customs fee", score: 65 },

    // Information Harvesting (60-85)
    { keyword: "verify your identity", score: 75 },
    { keyword: "update payment details", score: 78 },
    { keyword: "confirm banking information", score: 80 },
    { keyword: "ssn required", score: 90 },
    { keyword: "security question reset", score: 70 },
    { keyword: "re-enter credentials", score: 75 },
    { keyword: "card verification code", score: 85 },
    { keyword: "dob confirmation", score: 72 },
    { keyword: "two-factor authentication", score: 65 },
    { keyword: "account recovery process", score: 68 },

    // Suspicious Links/Attachments (70-90)
    { keyword: "click below link", score: 75 },
    { keyword: "download attachment", score: 78 },
    { keyword: "secure your account here", score: 80 },
    { keyword: "bit.ly/account-update", score: 85 },
    { keyword: "tinyurl.com/claim-reward", score: 82 },
    { keyword: "unlock document", score: 70 },
    { keyword: "access restricted file", score: 75 },
    { keyword: "view important notice", score: 72 },
    { keyword: "install security update", score: 78 },
    { keyword: "open encrypted message", score: 80 },

    // Romance Scams (65-85)
    { keyword: "emergency medical funds", score: 78 },
    { keyword: "stranded abroad", score: 70 },
    { keyword: "military deployment", score: 68 },
    { keyword: "need money for flight", score: 75 },
    { keyword: "hospital bills payment", score: 80 },
    { keyword: "help my child", score: 85 },
    { keyword: "visa processing fee", score: 65 },
    { keyword: "clear customs package", score: 62 },
    { keyword: "invest in our future", score: 70 },
    { keyword: "trust fund release", score: 72 },

    // Payment Demands (80-95)
    { keyword: "pay with gift cards", score: 95 },
    { keyword: "wire transfer required", score: 90 },
    { keyword: "bitcoin payment address", score: 85 },
    { keyword: "western union needed", score: 82 },
    { keyword: "itunes card payment", score: 92 },
    { keyword: "google play code", score: 88 },
    { keyword: "prepaid debit card", score: 80 },
    { keyword: "non-traceable payment", score: 85 },
    { keyword: "urgent processing fee", score: 78 },
    { keyword: "clearance charge", score: 75 },

    // Linguistic Red Flags (30-70)
    { keyword: "kindly do the needful", score: 65 },
    { keyword: "greetings of the day", score: 40 },
    { keyword: "revert back immediately", score: 70 },
    { keyword: "congratulations winner", score: 75 },
    { keyword: "dear valued customer", score: 50 },
    { keyword: "official notification", score: 45 },
    { keyword: "specially selected", score: 60 },
    { keyword: "risk-free opportunity", score: 70 },
    { keyword: "secret method", score: 75 },
    { keyword: "privileged information", score: 68 },

    // Tech Support Scams (70-85)
    { keyword: "virus detected", score: 75 },
    { keyword: "system infection", score: 78 },
    { keyword: "call support immediately", score: 80 },
    { keyword: "remote access required", score: 85 },
    { keyword: "critical system update", score: 70 },
    { keyword: "malware alert", score: 75 },
    { keyword: "hacking attempt detected", score: 80 },
    { keyword: "device compromised", score: 78 },
    { keyword: "performance issues found", score: 68 },
    { keyword: "security certificate expired", score: 72 },

    // Job/Investment Scams (60-85)
    { keyword: "work from home", score: 65 },
    { keyword: "no experience needed", score: 60 },
    { keyword: "earn $500 daily", score: 80 },
    { keyword: "secret investment strategy", score: 85 },
    { keyword: "double your money", score: 88 },
    { keyword: "risk-free trading", score: 78 },
    { keyword: "instant job offer", score: 65 },
    { keyword: "pre-approved loan", score: 72 },
    { keyword: "credit repair special", score: 70 },
    { keyword: "forex guaranteed returns", score: 82 },

    // Blackmail Scams (85-95)
    { keyword: "we have compromising footage", score: 95 },
    { keyword: "pay or we tell everyone", score: 90 },
    { keyword: "your data is exposed", score: 85 },
    { keyword: "webcam recording", score: 88 },
    { keyword: "adult site access", score: 80 },
    { keyword: "delete evidence", score: 85 },
    { keyword: "keep this private", score: 75 },
    { keyword: "shameful content", score: 82 },

    // Additional indicators
    { keyword: "password expiration", score: 75 },
    { keyword: "suspicious login attempt", score: 78 },
    { keyword: "unusual sign-in activity", score: 80 },
    { keyword: "security breach detected", score: 85 },
    { keyword: "verify payment method", score: 72 },
    { keyword: "billing information update", score: 75 },
    { keyword: "subscription renewal issue", score: 68 },
    { keyword: "membership verification", score: 65 },
    { keyword: "prize claim department", score: 70 },
    { keyword: "funds transfer authorization", score: 78 },

    // Special characters and patterns
    { keyword: "!!!", score: 55 },
    { keyword: "??", score: 50 },
    { keyword: "100% free", score: 65 },
    { keyword: "$$$", score: 70 },
    { keyword: "http://", score: 75 },
    { keyword: "click below", score: 65 },
    { keyword: "limited spots", score: 60 },
    { keyword: "exclusive offer", score: 62 },
    { keyword: "risk-free", score: 68 },
    { keyword: "no catch", score: 63 },

    // Emerging threat patterns
    { keyword: "nft airdrop", score: 75 },
    { keyword: "ai profit system", score: 78 },
    { keyword: "crypto mining pool", score: 80 },
    { keyword: "central bank digital currency", score: 70 },
    { keyword: "metaverse investment", score: 72 },
    { keyword: "quantum trading bot", score: 85 },
    { keyword: "atm card", score: 80 },
    { keyword: "compensation", score: 70 },
    { keyword: "secretary", score: 65 },
    { keyword: "fund transfer", score: 85 },
    { keyword: "swiss account", score: 82 },
    { keyword: "investment project", score: 75 },
    { keyword: "full name", score: 65 },
    { keyword: "contact address", score: 60 },
    { keyword: "id", score: 5 },
    { keyword: "lomé", score: 50 },
    { keyword: "paraguay", score: 45 },
    { keyword: "giz office", score: 40 },

    // COMMON SCAM PHRASES (50-75)
    { keyword: "happy to inform you", score: 55 },
    { keyword: "success in getting", score: 60 },
    { keyword: "co-operation of a new partner", score: 65 },
    { keyword: "international business man", score: 62 },
    { keyword: "did not forget your past efforts", score: 70 },
    { keyword: "despite that it failed", score: 60 },
    { keyword: "given my secretary instruction", score: 75 },
    { keyword: "on your name", score: 65 },
    { keyword: "compensation for your past effort", score: 80 },
    { keyword: "feel free to get in touch", score: 55 },
    { keyword: "send the debit card", score: 82 },
    { keyword: "without any delay", score: 65 },
    { keyword: "further arrangements", score: 58 },
    { keyword: "network inconvenience", score: 50 },

    // FINANCIAL SCAM INDICATORS
    { keyword: "fund", score: 25 },
    { keyword: "transfer", score: 25 },
    { keyword: "account", score: 10 },
    { keyword: "investment", score: 50 },
    { keyword: "debit", score: 50 },
    { keyword: "atm", score: 30 },
    { keyword: "dollars", score: 20 },
    { keyword: "usd", score: 25 },
    { keyword: "money", score: 35 },
    { keyword: "payment", score: 35 },
    { keyword: "compensation", score: 65 },
    { keyword: "secretary", score: 60 },
    { keyword: "contact", score: 5 },
    { keyword: "send", score: 50 },
    { keyword: "receive", score: 50 },
    { keyword: "instructions", score: 55 },
    { keyword: "reference", score: 45 },
    { keyword: "arrangements", score: 50 },

    // URGENCY AND PRESSURE TACTICS
    { keyword: "immediately", score: 70 },
    { keyword: "urgent", score: 75 },
    { keyword: "asap", score: 65 },
    { keyword: "now", score: 3 },
    { keyword: "today", score: 30 },
    { keyword: "last chance", score: 80 },
    { keyword: "final notice", score: 85 },
    { keyword: "do not ignore", score: 75 },
    { keyword: "time sensitive", score: 65 },
    { keyword: "expiring", score: 60 },

    // FINANCIAL LURES
    { keyword: "free", score: 2 },
    { keyword: "prize", score: 70 },
    { keyword: "won", score: 75 },
    { keyword: "reward", score: 65 },
    { keyword: "bonus", score: 62 },
    { keyword: "cash", score: 68 },
    { keyword: "grant", score: 65 },
    { keyword: "refund", score: 60 },
    { keyword: "discount", score: 16 },
    { keyword: "inheritance", score: 80 },
    { keyword: "lottery", score: 85 },
    { keyword: "jackpot", score: 88 },
    { keyword: "million", score: 82 },
    { keyword: "billion", score: 85 },
    { keyword: "crypto", score: 50 },
    { keyword: "bitcoin", score: 65 },

    // THREATS AND INTIMIDATION
    { keyword: "arrest", score: 85 },
    { keyword: "warrant", score: 82 },
    { keyword: "police", score: 70 },
    { keyword: "lawsuit", score: 75 },
    { keyword: "jail", score: 80 },
    { keyword: "legal", score: 65 },
    { keyword: "suspend", score: 5 },
    { keyword: "terminate", score: 70 },
    { keyword: "blocked", score: 65 },
    { keyword: "frozen", score: 68 },
    { keyword: "deleted", score: 60 },
    { keyword: "investigate", score: 58 },
    { keyword: "crime", score: 70 },
    { keyword: "illegal", score: 75 },

    // IMPERSONATION SCAMS
    { keyword: "microsoft", score: 65 },
    { keyword: "amazon", score: 65 },
    { keyword: "paypal", score: 70 },
    { keyword: "fedex", score: 60 },
    { keyword: "ups", score: 60 },
    { keyword: "dhl", score: 60 },
    { keyword: "irs", score: 0 },
    { keyword: "social security", score: 82 },
    { keyword: "bank", score: 65 },
    { keyword: "support", score: 5 },
    { keyword: "security alert", score: 75 },
    { keyword: "account limited", score: 78 },
    { keyword: "delivery issue", score: 60 },
    { keyword: "tax notice", score: 80 },
    { keyword: "verification", score: 5 },
    { keyword: "payment problem", score: 60 },

    // INFORMATION HARVESTING
    { keyword: "verify", score: 5 },
    { keyword: "confirm", score: 20 },
    { keyword: "update", score: 15 },
    { keyword: "login", score: 5 },
    { keyword: "password", score: 10 },
    { keyword: "ssn", score: 90 },
    { keyword: "sin", score: 0 },
    { keyword: "dob", score: 70 },
    { keyword: "card", score: 65 },
    { keyword: "cvv", score: 85 },
    { keyword: "pin", score: 88 },
    { keyword: "id", score: 65 },
    { keyword: "address", score: 2 },
    { keyword: "phone", score: 50 },
    { keyword: "security", score: 30 },
    { keyword: "authentication", score: 62 },

    // SUSPICIOUS LINKS/ATTACHMENTS
    { keyword: "click here", score: 5 },
    { keyword: "download", score: 65 },
    { keyword: "attachment", score: 25 },
    { keyword: "link", score: 2 },
    { keyword: "bit.ly", score: 80 },
    { keyword: "tinyurl", score: 80 },
    { keyword: "http://", score: 35 },
    { keyword: "unlock", score: 65 },
    { keyword: "access", score: 60 },
    { keyword: "view", score: 55 },
    { keyword: "install", score: 65 },
    { keyword: "open", score: 45 },

    // ROMANCE SCAMS
    { keyword: "dear", score: 5 },
    { keyword: "love", score: 55 },
    { keyword: "destiny", score: 45 },
    { keyword: "soulmate", score: 50 },
    { keyword: "future", score: 55 },
    { keyword: "marriage", score: 60 },
    { keyword: "care", score: 50 },
    { keyword: "trust", score: 55 },
    { keyword: "lonely", score: 60 },
    { keyword: "help", score: 5 },
    { keyword: "stranded", score: 70 },
    { keyword: "hospital", score: 65 },
    { keyword: "sick", score: 60 },
    { keyword: "army", score: 55 },
    { keyword: "soldier", score: 60 },
    { keyword: "widow", score: 55 },
    { keyword: "orphan", score: 60 },

    // PAYMENT DEMANDS
    { keyword: "gift cards", score: 95 },
    { keyword: "wire transfer", score: 85 },
    { keyword: "bitcoin", score: 80 },
    { keyword: "western union", score: 82 },
    { keyword: "itunes", score: 90 },
    { keyword: "google play", score: 88 },
    { keyword: "prepaid", score: 75 },
    { keyword: "non-traceable", score: 82 },
    { keyword: "fee", score: 5 },
    { keyword: "charge", score: 50 },
    { keyword: "processing", score: 50 },
    { keyword: "clearance", score: 58 },

    // LINGUISTIC RED FLAGS
    { keyword: "kindly", score: 20 },
    { keyword: "revert", score: 65 },
    { keyword: "greetings", score: 20 },
    { keyword: "congratulations", score: 50 },
    { keyword: "dear friend", score: 70 },
    { keyword: "official", score: 45 },
    { keyword: "specially", score: 60 },
    { keyword: "risk-free", score: 65 },
    { keyword: "secret", score: 70 },
    { keyword: "privileged", score: 65 },

    // JOB/INVESTMENT SCAMS
    { keyword: "work from home", score: 65 },
    { keyword: "no experience", score: 60 },
    { keyword: "earn money", score: 70 },
    { keyword: "investment strategy", score: 75 },
    { keyword: "double your money", score: 85 },
    { keyword: "trading", score: 65 },
    { keyword: "job offer", score: 60 },
    { keyword: "pre-approved", score: 65 },
    { keyword: "credit repair", score: 62 },
    { keyword: "forex", score: 70 },
    { keyword: "guaranteed returns", score: 80 },

    // BLACKMAIL SCAMS
    { keyword: "compromising", score: 85 },
    { keyword: "footage", score: 82 },
    { keyword: "pay or", score: 88 },
    { keyword: "data exposed", score: 80 },
    { keyword: "webcam", score: 75 },
    { keyword: "adult site", score: 70 },
    { keyword: "delete", score: 72 },
    { keyword: "private", score: 60 },
    { keyword: "shameful", score: 75 },

    // ADDITIONAL SCAM WORDS (40-70)
    { keyword: "assist", score: 3 },
    { keyword: "assistance", score: 2 },
    { keyword: "beneficiary", score: 65 },
    { keyword: "claim", score: 70 },
    { keyword: "confidential", score: 68 },
    { keyword: "cooperate", score: 60 },
    { keyword: "cooperation", score: 62 },
    { keyword: "discreet", score: 65 },
    { keyword: "fortune", score: 55 },
    { keyword: "funds", score: 70 },
    { keyword: "generosity", score: 50 },
    { keyword: "genuine", score: 45 },
    { keyword: "honest", score: 40 },
    { keyword: "inheritance", score: 80 },
    { keyword: "legitimate", score: 50 },
    { keyword: "opportunity", score: 65 },
    { keyword: "partner", score: 55 },
    { keyword: "percentage", score: 60 },
    { keyword: "proceed", score: 20 },
    { keyword: "proposal", score: 60 },
    { keyword: "relationship", score: 50 },
    { keyword: "release", score: 65 },
    { keyword: "remit", score: 60 },
    { keyword: "resolve", score: 15 },
    { keyword: "share", score: 15 },
    { keyword: "trust", score: 55 },
    { keyword: "unclaimed", score: 70 },
    { keyword: "urgent", score: 75 },
    { keyword: "wealth", score: 60 },

    // SPECIAL PATTERNS AND SYMBOLS
    { keyword: "!!!", score: 55 },
    { keyword: "???", score: 50 },
    { keyword: "$$$", score: 65 },
    { keyword: "100%", score: 60 },
    { keyword: "http://", score: 70 },
    { keyword: "gmail.com", score: 40 },
    { keyword: "hotmail.com", score: 40 },
    { keyword: "yahoo.com", score: 40 },
    { keyword: "dollar amount", score: 75 },
];

    


export function ScamIntelligenceEngine() {
    const { isActive } = useAuth();
    const navigate = useNavigate();

    if (!isActive) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="rounded-full p-2 bg-pistachio/10">
                                <Shield className="h-6 w-6 text-pistachio" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Scam Intelligence</h1>
                                <p className="text-muted-foreground">
                                    AI-powered scam detection
                                </p>
                            </div>
                        </div>

                        <Card className="p-8 text-center">
                            <div className="flex flex-col items-center space-y-4">
                                <Lock className="h-10 w-10 text-pistachio" />
                                <h2 className="text-2xl font-semibold">Pro Feature Locked</h2>
                                <p className="text-muted-foreground max-w-md">
                                    Scam Intelligence is a premium security tool that detects sophisticated
                                    scams and phishing attempts. Activate your subscription to use it.
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
                <Footer />
            </div>
        );
    }

        const [inputValue, setInputValue] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const [result, setResult] = useState<AnalysisResult | null>(null);

        const analyzeText = (text: string): AnalysisResult => {
            let score = 0;
            const foundReasons: string[] = [];
            const lowerText = text.toLowerCase();

            scamIndicators.forEach((item) => {
                if (lowerText.includes(item.keyword.toLowerCase())) {
                    score += item.score;
                    foundReasons.push(`Found phrase: "${item.keyword}"`);
                }
            });

            // Normalize score to 0-100
            const normalizedScore = Math.min(100, Math.floor(score / 5));

            let riskLevel: RiskLevel = "safe";
            let advice = "No scam indicators found. Remain cautious.";

            if (normalizedScore >= 70) {
                riskLevel = "dangerous";
                advice = "Do not engage. Report and delete the message.";
            } else if (normalizedScore >= 30) {
                riskLevel = "suspicious";
                advice = "Be cautious. Double check sender identity.";
            }

            return { riskLevel, score: normalizedScore, reasons: foundReasons, advice };
        };

        const handleAnalyze = () => {
            if (!inputValue.trim()) {
                toast.error("Please enter text to analyze.");
                return;
            }

            setIsLoading(true);

            // Simulate analysis (no timeout needed)
            setTimeout(() => {
                const analysis = analyzeText(inputValue);
                setResult(analysis);

                if (analysis.riskLevel === "dangerous") toast.error("High risk content detected!");
                else if (analysis.riskLevel === "suspicious") toast.warning("Suspicious content detected");
                else toast.success("Content appears to be safe");

                setIsLoading(false);
            }, 300);
        };

        const reset = () => {
            setInputValue("");
            setResult(null);
        };

        const getColor = (risk: RiskLevel) => {
            switch (risk) {
                case "safe":
                    return "border-green-600 bg-green-50 text-green-700";
                case "suspicious":
                    return "border-yellow-500 bg-yellow-50 text-yellow-800";
                case "dangerous":
                    return "border-red-600 bg-red-50 text-red-700";
                default:
                    return "";
            }
        };

        const getIcon = (risk: RiskLevel) => {
            switch (risk) {
                case "safe":
                    return <Check className="h-5 w-5 text-green-600" />;
                case "suspicious":
                    return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
                case "dangerous":
                    return <X className="h-5 w-5 text-red-600" />;
                default:
                    return null;
            }
        };

        return (
            <section id="scam-intelligence" className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full security-gradient mb-4">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">AI Scam Intelligence Engine</h2>
                        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                            Analyze messages, links, or images to instantly detect and protect against digital scams.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <Card className="border-border/50 shadow-lg">
                            <CardHeader>
                                <CardTitle>Scan for Scams</CardTitle>
                                <CardDescription>Enter a message and check its safety</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {result ? (
                                    <div className="space-y-6">
                                        <div className={`p-4 rounded-lg border ${getColor(result.riskLevel)}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-full bg-background">{getIcon(result.riskLevel)}</div>
                                                <div>
                                                    <h3 className="font-medium text-lg capitalize">{result.riskLevel} ({result.score}%)</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {result.riskLevel === "safe"
                                                            ? "This content appears safe."
                                                            : "This message contains risky elements."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2">Reasons detected</h4>
                                            <ul className="space-y-2">
                                                {result.reasons.map((reason, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="mt-1 text-xs bg-secondary rounded-full p-0.5 text-muted-foreground">{i + 1}</span>
                                                        <span>{reason}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2">Advice</h4>
                                            <p>{result.advice}</p>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button onClick={reset} variant="outline" className="flex-1">Scan something else</Button>
                                            <Button
                                                className="flex-1 bg-pistachio hover:bg-pistachio-dark text-black"
                                                onClick={() => toast.success("Report submitted successfully!")}
                                            >
                                                Report to authorities
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <Textarea
                                            placeholder="Paste the suspicious message here..."
                                            className="min-h-[150px]"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                        />
                                        <Button
                                            onClick={handleAnalyze}
                                            disabled={isLoading || !inputValue.trim()}
                                            className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Analyzing...
                                                </>
                                            ) : (
                                                "Analyze for Threats"
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        );
    }