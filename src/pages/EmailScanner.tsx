
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, AlertTriangle, CheckCircle, ShieldAlert, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type EmailAnalysisResult = {
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  score: number;
  issues: {
    category: string;
    problems: string[];
    severity: 'low' | 'medium' | 'high'; 
  }[];
  recommendations: string[];
};

const EmailScanner = () => {
  const [emailContent, setEmailContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmailAnalysisResult | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeEmailContent = (content: string): EmailAnalysisResult => {
    // Convert content to lowercase for case-insensitive matching
    const contentLower = content.toLowerCase();
    
    // Define patterns to look for
    const phishingKeywords = [
      'urgent', 'verify', 'account', 'password', 'click here', 'link', 'login', 'confirm',
      'suspended', 'security', 'unauthorized', 'unusual activity', 'bank', 'paypal', 'credit card'
    ];
    
    const scamKeywords = [
      'lottery', 'winner', 'million', 'inheritance', 'prince', 'donate', 'invest', 'bitcoin',
      'cryptocurrency', 'opportunity', 'offer', 'cash', 'money', 'funds', 'transfer', 'limited time'
    ];
    
    const personalInfoRequests = [
      'ssn', 'social security', 'date of birth', 'address', 'pin', 'card number',
      'credentials', 'username', 'password reset', 'verify identity', 'secure form'
    ];
    
    const urgencyTerms = [
      'immediate', 'urgent', 'warning', 'alert', 'now', 'today', 'expiration',
      '24 hours', '48 hours', 'deadline', 'limited', 'act now', 'immediately'
    ];
    
    const spoofedSenders = [
      'paypal', 'amazon', 'apple', 'microsoft', 'google', 'bank', 'netflix',
      'support', 'service', 'admin', 'helpdesk', 'security', 'account'
    ];

    // Calculate matches
    const phishingScore = phishingKeywords.filter(word => contentLower.includes(word)).length;
    const scamScore = scamKeywords.filter(word => contentLower.includes(word)).length;
    const personalInfoScore = personalInfoRequests.filter(word => contentLower.includes(word)).length;
    const urgencyScore = urgencyTerms.filter(word => contentLower.includes(word)).length;
    const spoofedScore = spoofedSenders.filter(word => contentLower.includes(word)).length;
    
    // Calculate overall risk score (0-100)
    const totalKeywords = phishingKeywords.length + scamKeywords.length + 
                         personalInfoRequests.length + urgencyTerms.length + spoofedSenders.length;
    
    const matchedKeywords = phishingScore + scamScore + personalInfoScore + urgencyScore + spoofedScore;
    
    // Weight factors based on severity
    const weightedScore = (phishingScore * 2) + (scamScore * 1.5) + 
                         (personalInfoScore * 2.5) + (urgencyScore * 1) + (spoofedScore * 2);
                         
    // Calculate final score (0-100)
    const maxPossibleWeightedScore = (phishingKeywords.length * 2) + (scamKeywords.length * 1.5) +
                                   (personalInfoRequests.length * 2.5) + (urgencyTerms.length * 1) +
                                   (spoofedSenders.length * 2);
    
    const finalScore = Math.min(Math.round((weightedScore / (maxPossibleWeightedScore * 0.4)) * 100), 100);
    
    // Determine risk level
    let riskLevel: 'safe' | 'suspicious' | 'dangerous';
    if (finalScore < 25) {
      riskLevel = 'safe';
    } else if (finalScore < 65) {
      riskLevel = 'suspicious';
    } else {
      riskLevel = 'dangerous';
    }
    
    // Build issues array
    const issues = [];
    
    if (phishingScore > 0) {
      issues.push({
        category: "Phishing Indicators",
        problems: phishingKeywords.filter(word => contentLower.includes(word)).map(word => 
          `Contains phishing keyword: "${word}"`
        ),
        severity: phishingScore > 2 ? 'high' : phishingScore > 0 ? 'medium' : 'low'
      });
    }
    
    if (scamScore > 0) {
      issues.push({
        category: "Scam Indicators",
        problems: scamKeywords.filter(word => contentLower.includes(word)).map(word => 
          `Contains scam keyword: "${word}"`
        ),
        severity: scamScore > 2 ? 'high' : scamScore > 0 ? 'medium' : 'low'
      });
    }
    
    if (personalInfoScore > 0) {
      issues.push({
        category: "Personal Information Requests",
        problems: personalInfoRequests.filter(word => contentLower.includes(word)).map(word => 
          `Requests sensitive information: "${word}"`
        ),
        severity: personalInfoScore > 1 ? 'high' : 'medium'
      });
    }
    
    if (urgencyScore > 0) {
      issues.push({
        category: "Urgency Tactics",
        problems: urgencyTerms.filter(word => contentLower.includes(word)).map(word => 
          `Uses urgency to prompt action: "${word}"`
        ),
        severity: urgencyScore > 2 ? 'high' : 'medium'
      });
    }
    
    if (spoofedScore > 0) {
      issues.push({
        category: "Sender Authenticity",
        problems: spoofedSenders.filter(word => contentLower.includes(word)).map(word => 
          `Possible impersonation of: "${word}"`
        ),
        severity: spoofedScore > 1 ? 'high' : 'medium'
      });
    }
    
    // If no issues found, add a safe category
    if (issues.length === 0) {
      issues.push({
        category: "Email Analysis",
        problems: ["No suspicious content detected"],
        severity: 'low'
      });
    }
    
    // Generate recommendations based on risk level
    const recommendations = [];
    
    if (riskLevel === 'dangerous') {
      recommendations.push(
        "Do not click any links in this email",
        "Do not download any attachments",
        "Report this email as phishing to your provider",
        "Block the sender immediately",
        "If you've already clicked links or shared information, change your passwords"
      );
    } else if (riskLevel === 'suspicious') {
      recommendations.push(
        "Exercise caution with this email",
        "Verify the sender through other channels before taking action",
        "Do not share sensitive information",
        "Hover over links before clicking to verify their destination"
      );
    } else {
      recommendations.push(
        "This email appears to be safe",
        "Always remain vigilant with unexpected communications"
      );
    }
    
    return {
      riskLevel,
      score: finalScore,
      issues,
      recommendations
    };
  };

  const handleScan = () => {
    if (!emailContent && !imagePreview) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // If we have text content, analyze it
      let mockResult: EmailAnalysisResult;
      
      if (emailContent) {
        mockResult = analyzeEmailContent(emailContent);
      } else {
        // For image analysis, we'd normally use OCR, but for demo we'll use a simulated result
        mockResult = {
          riskLevel: 'suspicious',
          score: 58,
          issues: [
            {
              category: "Image Analysis",
              problems: [
                "Image-based email detected (often used to bypass text filters)",
                "Contains elements commonly found in phishing attempts"
              ],
              severity: 'medium'
            }
          ],
          recommendations: [
            "Exercise caution with image-based emails",
            "Verify the sender through other channels",
            "Do not share sensitive information"
          ]
        };
      }
      
      // Store the report in localStorage for admin panel to access
      const reports = JSON.parse(localStorage.getItem('pistaSecure_scamReports') || '[]');
      reports.push({
        type: 'email',
        content: emailContent || 'Image upload',
        result: mockResult,
        date: new Date().toISOString(),
        id: `email-${Date.now()}`
      });
      localStorage.setItem('pistaSecure_scamReports', JSON.stringify(reports));
      
      setResult(mockResult);
      setIsLoading(false);
      
      // Notify about the scan
      toast({
        title: "Email scan complete",
        description: `Risk level: ${mockResult.riskLevel}`,
      });
    }, 1500);
  };

  const getRatingColor = (risk: 'safe' | 'suspicious' | 'dangerous') => {
    switch (risk) {
      case 'safe': return "text-success border-success bg-success/10";
      case 'suspicious': return "text-warning border-warning bg-warning/10";
      case 'dangerous': return "text-destructive border-destructive bg-destructive/10";
    }
  };

  const getRatingIcon = (risk: 'safe' | 'suspicious' | 'dangerous') => {
    switch (risk) {
      case 'safe': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'suspicious': return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'dangerous': return <ShieldAlert className="h-5 w-5 text-destructive" />;
    }
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return "bg-success/10 text-success";
      case 'medium': return "bg-warning/10 text-warning";
      case 'high': return "bg-destructive/10 text-destructive";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Email Threat Scanner</h1>
          <p className="text-muted-foreground mb-8">
            Analyze emails for phishing attempts, spoofing, and other security threats.
          </p>
          
          {!result ? (
            <Card>
              <CardHeader>
                <CardTitle>Scan Email</CardTitle>
                <CardDescription>
                  Paste the email content or upload a screenshot to analyze
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {!imagePreview ? (
                    <>
                      <Textarea
                        placeholder="Paste the email content here..."
                        className="min-h-[200px]"
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                      />
                      
                      <div className="flex items-center">
                        <div className="flex-grow border-t border-border"></div>
                        <span className="px-4 text-sm text-muted-foreground">or</span>
                        <div className="flex-grow border-t border-border"></div>
                      </div>
                      
                      <div className="border-2 border-dashed border-border rounded-md p-8">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                          <p className="text-sm font-medium">
                            Upload a screenshot of the email
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            JPG, PNG or screenshot of the suspicious email
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => {
                              const input = document.querySelector('input[type="file"]');
                              if (input) {
                                (input as HTMLElement).click();
                              }
                            }}
                          >
                            Select image
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Email screenshot"
                        className="max-h-[300px] mx-auto rounded-md"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full"
                        onClick={() => setImagePreview(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleScan}
                  disabled={isLoading || (!emailContent && !imagePreview)}
                  className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      Scanning...
                    </>
                  ) : "Scan Email"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getRatingColor(result.riskLevel)}`}>
                  {getRatingIcon(result.riskLevel)}
                  <span className="font-medium capitalize">{result.riskLevel}</span>
                  <span className="text-sm">({result.score}% risk)</span>
                </div>
                <CardTitle className="mt-4">Email Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {result.issues.map((issue, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{issue.category}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {issue.problems.map((problem, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 flex-shrink-0 text-xs bg-secondary w-4 h-4 flex items-center justify-center rounded-full text-muted-foreground">
                            {i + 1}
                          </span>
                          <span>{problem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                <div className="border-t border-border pt-4 space-y-2">
                  <h3 className="font-medium">Recommendations</h3>
                  <ul className="space-y-2 text-sm">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setResult(null);
                      setEmailContent("");
                      setImagePreview(null);
                    }}
                  >
                    Scan Another Email
                  </Button>
                  <Button 
                    className="flex-1 bg-pistachio hover:bg-pistachio-dark text-black"
                    onClick={() => {
                      // In a real app, this would report the email
                      alert("Email reported as phishing!");
                    }}
                  >
                    Report as Phishing
                  </Button>
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

export default EmailScanner;
