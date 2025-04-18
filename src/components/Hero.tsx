
import { ArrowRight, Shield, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/90 pt-8 pb-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-pistachio/10 blur-3xl"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[300px] w-[300px] translate-x-1/3 rounded-full bg-pistachio/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-pistachio text-xs text-black">
              ✓
            </span>
            <span>AI-Powered Protection for the Digital Age</span>
          </div>

          <h1 className="mt-8 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Stay Secure with{" "}
            <span className="relative">
              <span className="absolute inset-x-0 bottom-2 h-3 bg-pistachio/30 skew-x-3"></span>
              <span className="relative">PistaSecure</span>
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            AI-powered security that detects and stops digital scams before they happen. Inspect links, identify phishing attempts, and get real-time protection.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button 
              size="lg" 
              className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
              onClick={handleGetStarted}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
                      <Button
                          size="lg"
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate('/how-it-works')}
                      >
                          How It Works
                      </Button>

          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3 max-w-3xl">
            {[
              { icon: ShieldCheck, label: "AI Scam Detection", description: "Identify threats in seconds" },
              { icon: Shield, label: "Link Protection", description: "Check any URL for safety" },
              { icon: Shield, label: "Privacy Shield", description: "Keep your data protected" },
            ].map((feature, i) => (
              <div key={i} className="security-card p-4">
                <div className="rounded-full w-10 h-10 mb-3 security-gradient flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-medium">{feature.label}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
