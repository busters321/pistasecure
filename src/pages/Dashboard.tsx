
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Link, Mail, MessageCircle, Globe, Instagram, Key, FileText, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // This is a simple mock of authentication check
  // In a real app, you would use a proper auth system
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("pistaSecure_isLoggedIn");
    if (!isLoggedIn) {
      localStorage.setItem("pistaSecure_isLoggedIn", "true");
    }
  }, [navigate]);

  const features = [
    {
      icon: Shield,
      title: "AI Scam Intelligence",
      description: "Detect scams using text, links, or screenshots",
      path: "/scam-intelligence"
    },
    {
      icon: Link,
      title: "Deep Link Inspection",
      description: "Analyze URLs for safety and behavior",
      path: "/link-inspection"
    },
    {
      icon: Mail,
      title: "Email Threat Scanner",
      description: "Check emails for phishing and spoofing",
      path: "/email-scanner"
    },
    {
      icon: MessageCircle,
      title: "Cyber Copilot Chat",
      description: "Get AI security advice and answers",
      path: "/cyber-copilot"
    },
    {
      icon: Globe,
      title: "SafeView Browser",
      description: "Browse securely in a sandbox environment",
      path: "/safe-view"
    },
    {
      icon: Instagram,
      title: "Social Media Protection",
      description: "Detect fake profiles and scam accounts",
      path: "/social-protection"
    },
    {
      icon: Key,
      title: "Password Risk Checker",
      description: "Check if your passwords have been leaked",
      path: "/password-checker"
    },
    {
      icon: FileText,
      title: "Scam Report Generator",
      description: "Create and send scam reports easily",
      path: "/scam-report"
    },
    {
      icon: BarChart3,
      title: "Live Threat Feed",
      description: "See real-time scam trends and alerts",
      path: "/threat-feed"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to PistaSecure</h1>
          <p className="text-muted-foreground">
            Your digital security dashboard. Choose a tool to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="rounded-full w-10 h-10 mb-3 bg-pistachio/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-pistachio" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-pistachio/10 hover:text-pistachio"
                  onClick={() => navigate(feature.path)}
                >
                  Launch Tool
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
