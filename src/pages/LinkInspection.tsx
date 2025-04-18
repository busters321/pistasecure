import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, ExternalLink, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

type LinkAnalysisResult = {
  originalUrl: string;
  finalUrl: string;
  redirectCount: number;
  trustRating: 'safe' | 'suspicious' | 'dangerous';
  score: number;
  reasons: string[];
  domainAge?: string;
  ssl?: boolean;
};

const LinkInspection = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LinkAnalysisResult | null>(null);

  const validateUrl = (input: string): string => {
    let processedUrl = input.trim();
    
    // Check if the URL starts with http:// or https://
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }
    
    try {
      // This will throw an error if the URL is invalid
      new URL(processedUrl);
      return processedUrl;
    } catch (e) {
      toast.error("Please enter a valid URL");
      return "";
    }
  };

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  const handleAnalyze = () => {
    if (!url) return;
    
    const validatedUrl = validateUrl(url);
    if (!validatedUrl) return;
    
    setIsLoading(true);
    
    // Simulate API call with more realistic logic
    setTimeout(() => {
      // Extract domain from URL
      let domain;
      try {
        domain = new URL(validatedUrl).hostname;
      } catch (e) {
        domain = validatedUrl;
      }
      
      // Define risk factors based on URL characteristics
      const hasShortener = domain.includes("bit.ly") || domain.includes("goo.gl") || domain.includes("tinyurl") || domain.includes("t.co");
      const hasNumbers = /\d/.test(domain);
      const isDashSeparated = domain.includes("-");
      const hasSuspiciousKeywords = validatedUrl.toLowerCase().includes("free") || 
                                   validatedUrl.toLowerCase().includes("prize") || 
                                   validatedUrl.toLowerCase().includes("win") || 
                                   validatedUrl.toLowerCase().includes("crypto") ||
                                   validatedUrl.toLowerCase().includes("wallet");
      const isUncommonTLD = !domain.endsWith(".com") && 
                           !domain.endsWith(".org") && 
                           !domain.endsWith(".net") && 
                           !domain.endsWith(".edu") && 
                           !domain.endsWith(".gov");
      
      // Calculate risk factors count
      const riskFactors = [hasShortener, hasNumbers, isDashSeparated, hasSuspiciousKeywords, isUncommonTLD].filter(Boolean).length;
      
      // Determine risk level based on factors
      let trustRating: 'safe' | 'suspicious' | 'dangerous' = 'safe';
      let score = 0;
      let redirectCount = 0;
      let reasons: string[] = [];
      let finalUrl = validatedUrl;
      let domainAge = "";
      let ssl = true;
      
      // Popular trusted domains
      const trustedDomains = [
        "google.com", "youtube.com", "facebook.com", "twitter.com", "instagram.com", 
        "linkedin.com", "amazon.com", "microsoft.com", "apple.com", "github.com",
        "stackoverflow.com", "wikipedia.org", "reddit.com", "netflix.com", "nytimes.com"
      ];
      
      // Check if it's a known trusted domain
      const isTrustedDomain = trustedDomains.some(trusted => domain.endsWith(trusted));
      
      if (isTrustedDomain) {
        // Known trusted domain
        trustRating = 'safe';
        score = getRandomInt(0, 20);
        redirectCount = 0;
        reasons = [
          "Established trusted domain",
          "No suspicious redirects",
          "Valid SSL certificate"
        ];
        domainAge = "5+ years";
        ssl = true;
      } else if (riskFactors >= 3 || hasSuspiciousKeywords) {
        // High risk
        trustRating = 'dangerous';
        score = getRandomInt(70, 95);
        redirectCount = getRandomInt(2, 5);
        
        reasons = [];
        if (hasShortener) reasons.push("URL shortener detected");
        if (hasNumbers) reasons.push("Domain contains unusual number patterns");
        if (isDashSeparated) reasons.push("Domain uses excessive hyphens");
        if (hasSuspiciousKeywords) reasons.push("Contains phishing or scam keywords");
        if (isUncommonTLD) reasons.push("Uses uncommon top-level domain");
        
        // Add additional reasons
        if (Math.random() > 0.5) reasons.push("Domain registered in the last 48 hours");
        if (Math.random() > 0.7) {
          reasons.push("Missing SSL certificate");
          ssl = false;
        }
        
        // Generate a fake final URL for redirects
        finalUrl = hasShortener ? validatedUrl.replace(domain, "malicious-site" + getRandomInt(100, 999) + ".xyz") : validatedUrl;
        domainAge = ["1 day", "3 days", "1 week", "2 weeks"][getRandomInt(0, 3)];
      } else if (riskFactors >= 1) {
        // Medium risk
        trustRating = 'suspicious';
        score = getRandomInt(35, 65);
        redirectCount = getRandomInt(0, 2);
        
        reasons = [];
        if (hasShortener) reasons.push("URL shortener detected");
        if (hasNumbers && Math.random() > 0.5) reasons.push("Domain contains unusual number patterns");
        if (isDashSeparated && Math.random() > 0.5) reasons.push("Domain uses hyphens");
        if (isUncommonTLD) reasons.push("Uses uncommon top-level domain");
        
        // Add additional context
        if (reasons.length < 2) reasons.push("Domain has limited web presence");
        
        finalUrl = hasShortener ? validatedUrl.replace(domain, "ad-site" + getRandomInt(10, 99) + ".com") : validatedUrl;
        domainAge = ["1 month", "3 months", "6 months", "11 months"][getRandomInt(0, 3)];
        ssl = Math.random() > 0.3;
      } else {
        // Low risk
        trustRating = 'safe';
        score = getRandomInt(0, 25);
        redirectCount = 0;
        reasons = [
          "No known risk factors",
          "No suspicious redirects",
          "Valid SSL certificate"
        ];
        domainAge = ["1+ years", "2+ years", "3+ years", "5+ years"][getRandomInt(0, 3)];
        ssl = true;
      }
      
      const mockResult: LinkAnalysisResult = {
        originalUrl: validatedUrl,
        finalUrl,
        redirectCount,
        trustRating,
        score,
        reasons,
        domainAge,
        ssl
      };
      
      setResult(mockResult);
      setIsLoading(false);
      
      // Show a toast notification
      if (trustRating === 'dangerous') {
        toast.error("High risk URL detected!");
      } else if (trustRating === 'suspicious') {
        toast.warning("This URL may not be safe");
      } else {
        toast.success("URL appears to be safe");
      }
    }, 1500);
  };

  const getRatingColor = (rating: 'safe' | 'suspicious' | 'dangerous') => {
    switch (rating) {
      case 'safe': return "text-success border-success bg-success/10";
      case 'suspicious': return "text-warning border-warning bg-warning/10";
      case 'dangerous': return "text-destructive border-destructive bg-destructive/10";
    }
  };

  const getRatingIcon = (rating: 'safe' | 'suspicious' | 'dangerous') => {
    switch (rating) {
      case 'safe': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'suspicious': return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'dangerous': return <ShieldAlert className="h-5 w-5 text-destructive" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Deep Link Inspection</h1>
          <p className="text-muted-foreground mb-8">
            Analyze URLs to detect redirects, check domain reputation, and identify potentially harmful websites.
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Check Link Safety</CardTitle>
              <CardDescription>
                Enter any URL to analyze its safety and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter URL to analyze... (e.g. google.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-grow"
                  />
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={!url || isLoading}
                    className="bg-pistachio hover:bg-pistachio-dark text-black"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                        Analyzing...
                      </>
                    ) : "Analyze Link"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {result && (
            <Card className="shadow-lg">
              <CardHeader>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getRatingColor(result.trustRating)}`}>
                  {getRatingIcon(result.trustRating)}
                  <span className="font-medium capitalize">{result.trustRating}</span>
                  <span className="text-sm">({result.score}% risk)</span>
                </div>
                <CardTitle className="mt-4">Link Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Original URL</p>
                    <div className="p-3 bg-muted rounded-md flex items-center gap-2 text-muted-foreground">
                      <Link className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm break-all">{result.originalUrl}</span>
                    </div>
                  </div>
                  
                  {result.originalUrl !== result.finalUrl && (
                    <div>
                      <p className="text-sm font-medium mb-1">Final Destination</p>
                      <div className="p-3 bg-muted rounded-md flex items-center gap-2 text-muted-foreground">
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm break-all">{result.finalUrl}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        This link follows {result.redirectCount} redirect(s) before reaching its final destination
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <p className="text-sm font-medium mb-2">Domain Age</p>
                      <p>{result.domainAge}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">SSL Security</p>
                      <p>{result.ssl ? "Valid certificate" : "Invalid or missing"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Risk Factors</p>
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
                  
                  <div className="pt-4 flex gap-3">
                    <Button className="flex-1" variant="outline" onClick={() => setResult(null)}>
                      Check Another Link
                    </Button>
                    <Button 
                      className="flex-1 bg-pistachio hover:bg-pistachio-dark text-black"
                      onClick={() => window.open(`/safe-view?url=${encodeURIComponent(result.originalUrl)}`, "_blank")}
                    >
                      Open in SafeView
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LinkInspection;
