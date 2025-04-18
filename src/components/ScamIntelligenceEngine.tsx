import { useState } from "react";
import { Shield, AlertTriangle, X, Check, Upload, Link, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { analyzeContent, getRiskColor } from "./utils";

export type RiskLevel = "safe" | "suspicious" | "dangerous" | null;
export type InputType = "text" | "link" | "image";

export interface AnalysisResult {
    riskLevel: RiskLevel;
    score: number;
    reasons: string[];
    advice: string;
}

export function ScamIntelligenceEngine() {
    const [inputType, setInputType] = useState<InputType>("text");
    const [inputValue, setInputValue] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string);
            setInputValue("IMAGE_UPLOADED");
        };
        reader.readAsDataURL(file);
    };

    const handleAnalyze = () => {
        // If no input is provided, do nothing (or you can show an error toast)
        if (!inputValue && !imagePreview) {
            toast.error("Please enter text, link or upload an image to analyze.");
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            try {
                let analysisResult: AnalysisResult;

                if (inputType === "image") {
                    // Use a simulated image text for analysis (or integrate real OCR)
                    const simulatedImageText = `
            This is a message claiming you've won a prize.
            Please verify your account by sending your password and credit card details.
            This offer is urgent and expires today!
          `;
                    analysisResult = analyzeContent(simulatedImageText, "image");
                } else {
                    analysisResult = analyzeContent(inputValue, inputType);
                }

                setResult(analysisResult);

                if (analysisResult.riskLevel === "dangerous") {
                    toast.error("High risk content detected!");
                } else if (analysisResult.riskLevel === "suspicious") {
                    toast.warning("Suspicious content detected");
                } else {
                    toast.success("Content appears to be safe");
                }
            } catch (error) {
                console.error("Error analyzing content:", error);
                toast.error("Analysis failed");
            } finally {
                setIsLoading(false);
            }
        }, 1500);
    };

    const resetAnalysis = () => {
        setInputValue("");
        setImagePreview(null);
        setResult(null);
    };

    const getRiskIcon = (risk: RiskLevel) => {
        switch (risk) {
            case "safe":
                return <Check className="h-5 w-5 text-success" />;
            case "suspicious":
                return <AlertTriangle className="h-5 w-5 text-warning" />;
            case "dangerous":
                return <X className="h-5 w-5 text-danger" />;
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
                            <CardDescription>
                                Upload or paste content to analyze for potential threats
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {result ? (
                                <div className="space-y-6">
                                    <div className={`p-4 rounded-lg border ${getRiskColor(result.riskLevel)}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-background">
                                                {getRiskIcon(result.riskLevel)}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-lg capitalize">
                                                    {result.riskLevel} ({result.score}%)
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {result.riskLevel === "safe"
                                                        ? "This content appears to be safe."
                                                        : "This content contains suspicious elements."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">Why this rating?</h4>
                                        <ul className="space-y-2">
                                            {result.reasons.map((reason, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="mt-1 text-xs bg-secondary rounded-full p-0.5 text-muted-foreground">
                                                        {i + 1}
                                                    </span>
                                                    <span>{reason}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">Recommended action</h4>
                                        <p>{result.advice}</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button onClick={resetAnalysis} variant="outline" className="flex-1">
                                            Scan something else
                                        </Button>
                                        <Button
                                            className="flex-1 bg-pistachio hover:bg-pistachio-dark text-black"
                                            onClick={() => toast.success("Report submitted successfully!")}
                                        >
                                            Report to authorities
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Tabs
                                        defaultValue="text"
                                        onValueChange={(value) => {
                                            setInputType(value as InputType);
                                            setInputValue("");
                                            setImagePreview(null);
                                        }}
                                        className="w-full"
                                    >
                                        <TabsList className="grid grid-cols-3 mb-6">
                                            <TabsTrigger value="text">
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Text
                                            </TabsTrigger>
                                            <TabsTrigger value="link">
                                                <Link className="h-4 w-4 mr-2" />
                                                Link
                                            </TabsTrigger>
                                            <TabsTrigger value="image">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Image
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="text" className="mt-0">
                                            <Textarea
                                                placeholder="Paste the suspicious message or text here..."
                                                className="min-h-[150px]"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                            />
                                        </TabsContent>

                                        <TabsContent value="link" className="mt-0">
                                            <Input
                                                type="url"
                                                placeholder="Enter suspicious URL..."
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                            />
                                        </TabsContent>

                                        <TabsContent value="image" className="mt-0">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="w-full mb-4"
                                            />
                                            {imagePreview && (
                                                <div className="mt-4">
                                                    <img src={imagePreview} alt="Preview" className="max-w-full mx-auto rounded-md" />
                                                </div>
                                            )}
                                        </TabsContent>
                                    </Tabs>

                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={isLoading || (!inputValue && !imagePreview)}
                                        className="w-full mt-6 bg-pistachio hover:bg-pistachio-dark text-black"
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
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
