
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle, Lock, KeyRound } from "lucide-react";

type BreachSeverity = "none" | "low" | "medium" | "high" | "critical";

interface PasswordCheckResult {
  email: string;
  breachCount: number;
  breachedSites: string[];
  compromisedData: string[];
  breachSeverity: BreachSeverity;
  passwordStrength?: {
    score: number; // 0-4
    crackTime: string;
    suggestions: string[];
  };
  recommendations: string[];
}

const PasswordChecker = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PasswordCheckResult | null>(null);

  const handleCheck = () => {
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate mock result based on input
      const emailDomain = email.split('@')[1] || "";
      const hasCommonDomain = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"].includes(emailDomain);
      const isBreached = email.toLowerCase().includes("test") || email.toLowerCase().includes("admin") || !hasCommonDomain;
      
      let mockResult: PasswordCheckResult;
      
      if (isBreached) {
        const breachSeverity: BreachSeverity = password ? "high" : "medium";
        mockResult = {
          email,
          breachCount: Math.floor(Math.random() * 3) + 2,
          breachedSites: [
            "ExampleSite.com (2021)",
            "OnlineStore.net (2022)",
            password ? "SocialNetwork.com (2023)" : ""
          ].filter(Boolean),
          compromisedData: [
            "Email address",
            "Username",
            password ? "Password hash" : "",
            "IP address"
          ].filter(Boolean),
          breachSeverity,
          recommendations: [
            "Change your password immediately",
            "Enable two-factor authentication where available",
            "Use a unique password for each site",
            "Consider using a password manager"
          ]
        };
        
        // Add password strength check if provided
        if (password) {
          const hasUppercase = /[A-Z]/.test(password);
          const hasNumber = /[0-9]/.test(password);
          const hasSpecial = /[^A-Za-z0-9]/.test(password);
          const isLong = password.length >= 12;
          
          const score = [hasUppercase, hasNumber, hasSpecial, isLong].filter(Boolean).length;
          
          mockResult.passwordStrength = {
            score, // 0-4
            crackTime: score <= 1 ? "Seconds" : score === 2 ? "Hours" : score === 3 ? "Months" : "Years",
            suggestions: []
          };
          
          if (!hasUppercase) mockResult.passwordStrength.suggestions.push("Add uppercase letters");
          if (!hasNumber) mockResult.passwordStrength.suggestions.push("Add numbers");
          if (!hasSpecial) mockResult.passwordStrength.suggestions.push("Add special characters");
          if (!isLong) mockResult.passwordStrength.suggestions.push("Make it longer (12+ characters)");
        }
      } else {
        mockResult = {
          email,
          breachCount: 0,
          breachedSites: [],
          compromisedData: [],
          breachSeverity: "none",
          recommendations: [
            "Continue using unique passwords for each site",
            "Regularly check for new breaches",
            "Consider enabling two-factor authentication for important accounts"
          ]
        };
        
        // Add password strength check if provided
        if (password) {
          const hasUppercase = /[A-Z]/.test(password);
          const hasNumber = /[0-9]/.test(password);
          const hasSpecial = /[^A-Za-z0-9]/.test(password);
          const isLong = password.length >= 12;
          
          const score = [hasUppercase, hasNumber, hasSpecial, isLong].filter(Boolean).length;
          
          mockResult.passwordStrength = {
            score,
            crackTime: score <= 1 ? "Seconds" : score === 2 ? "Days" : score === 3 ? "Years" : "Centuries",
            suggestions: []
          };
          
          if (!hasUppercase) mockResult.passwordStrength.suggestions.push("Add uppercase letters");
          if (!hasNumber) mockResult.passwordStrength.suggestions.push("Add numbers");
          if (!hasSpecial) mockResult.passwordStrength.suggestions.push("Add special characters");
          if (!isLong) mockResult.passwordStrength.suggestions.push("Make it longer (12+ characters)");
        }
      }
      
      setResult(mockResult);
      setIsLoading(false);
    }, 1500);
  };
  
  const getSeverityColor = (severity: BreachSeverity) => {
    switch (severity) {
      case "none": return "text-success border-success bg-success/10";
      case "low": return "text-success border-success bg-success/10";
      case "medium": return "text-warning border-warning bg-warning/10";
      case "high": return "text-destructive border-destructive bg-destructive/10";
      case "critical": return "text-destructive border-destructive bg-destructive/10";
      default: return "";
    }
  };

  const getSeverityIcon = (severity: BreachSeverity) => {
    switch (severity) {
      case "none": 
      case "low": return <CheckCircle className="h-5 w-5 text-success" />;
      case "medium": return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "high":
      case "critical": return <Shield className="h-5 w-5 text-destructive" />;
      default: return null;
    }
  };
  
  const getPasswordStrengthColor = (score: number) => {
    switch (score) {
      case 0:
      case 1: return "text-destructive border-destructive bg-destructive/10";
      case 2: return "text-warning border-warning bg-warning/10";
      case 3: return "text-warning border-warning bg-warning/10";
      case 4: return "text-success border-success bg-success/10";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Password Risk Checker</h1>
          <p className="text-muted-foreground mb-8">
            Check if your email or credentials have been involved in any data breaches.
          </p>
          
          {!result ? (
            <Card>
              <CardHeader>
                <CardTitle>Check for Data Breaches</CardTitle>
                <CardDescription>
                  Enter your email to check if it has been exposed in data breaches. Optionally enter your password to check its strength.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password (Optional)</label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password to check strength"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="off"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your password is never stored or transmitted. Strength analysis happens locally in your browser.
                  </p>
                </div>
                
                <Button
                  onClick={handleCheck}
                  disabled={!email || isLoading}
                  className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      Checking...
                    </>
                  ) : "Check for Breaches"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getSeverityColor(result.breachSeverity)}`}>
                    {getSeverityIcon(result.breachSeverity)}
                    <span className="font-medium capitalize">
                      {result.breachCount === 0 ? "No breaches found" : `Found in ${result.breachCount} data breaches`}
                    </span>
                  </div>
                  <CardTitle className="mt-4">Data Breach Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Email Checked</p>
                    <p className="font-mono bg-muted p-2 rounded">{result.email}</p>
                  </div>
                  
                  {result.breachCount > 0 && (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-medium">Breached Websites</h3>
                        <ul className="space-y-2">
                          {result.breachedSites.map((site, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 mt-1 text-warning" />
                              <span>{site}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Compromised Data</h3>
                        <div className="flex flex-wrap gap-2">
                          {result.compromisedData.map((data, i) => (
                            <span key={i} className="bg-secondary text-xs px-2 py-1 rounded-full">
                              {data}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Recommendations</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Lock className="h-4 w-4 mt-1 flex-shrink-0 text-pistachio" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {result.passwordStrength && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getPasswordStrengthColor(result.passwordStrength.score)}`}>
                      <KeyRound className="h-4 w-4" />
                      <span className="font-medium capitalize">
                        {result.passwordStrength.score <= 1 ? "Weak Password" : 
                         result.passwordStrength.score === 2 ? "Moderate Password" :
                         result.passwordStrength.score === 3 ? "Strong Password" : "Very Strong Password"}
                      </span>
                    </div>
                    <CardTitle className="mt-4">Password Strength Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            result.passwordStrength.score <= 1 ? "bg-destructive" : 
                            result.passwordStrength.score === 2 ? "bg-warning" :
                            result.passwordStrength.score === 3 ? "bg-warning" : "bg-success"
                          }`}
                          style={{ width: `${(result.passwordStrength.score / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Approximate Time to Crack</p>
                      <p className="text-lg">{result.passwordStrength.crackTime}</p>
                    </div>
                    
                    {result.passwordStrength.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-medium">Improvement Suggestions</h3>
                        <ul className="space-y-2">
                          {result.passwordStrength.suggestions.map((suggestion, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Lock className="h-4 w-4 mt-1 flex-shrink-0 text-pistachio" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setResult(null);
                    setEmail("");
                    setPassword("");
                  }}
                >
                  Check Another Account
                </Button>
                <Button
                  className="flex-1 bg-pistachio hover:bg-pistachio-dark text-black"
                  onClick={() => {
                    // In a real app, this would generate a detailed PDF report
                    alert("Security report generated!");
                  }}
                >
                  Generate Security Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PasswordChecker;
