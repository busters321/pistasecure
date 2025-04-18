
import { ArrowRight, ShieldAlert, Link, Mail, MessageCircle, Globe, Users, Key, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: ShieldAlert,
    title: "AI Scam Intelligence",
    description: "Detect scams from text, links, or images with our AI engine",
    href: "#scam-intelligence",
  },
  {
    icon: Link,
    title: "Deep Link Inspection",
    description: "Reveal link behavior, redirects, and domain trust level",
    href: "#",
  },
  {
    icon: Mail,
    title: "Email Threat Scanner",
    description: "Spot phishing, spoofing, and impersonation attempts instantly",
    href: "#",
  },
  {
    icon: MessageCircle,
    title: "Cyber Copilot Chat",
    description: "Get security advice from an AI assistant anytime",
    href: "#",
  },
  {
    icon: Globe,
    title: "SafeView Browser",
    description: "Browse suspicious sites in a secure sandbox environment",
    href: "#",
  },
  {
    icon: Users,
    title: "Social Media Protection",
    description: "Detect fake profiles and scams across platforms",
    href: "#",
  },
  {
    icon: Key,
    title: "Password Risk Checker",
    description: "Find leaked credentials and weak password usage",
    href: "#",
  },
  {
    icon: FileText,
    title: "Scam Report Generator",
    description: "Create professional reports to share with authorities",
    href: "#",
  },
  {
    icon: Activity,
    title: "Live Threat Feed",
    description: "Track real-time scam trends by country or platform",
    href: "#",
  },
];

export function Features() {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Complete Security Suite</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive set of tools keeps you protected from all kinds of digital threats
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <a 
              href={feature.href} 
              key={i} 
              className="security-card p-6 group"
            >
              <div className="flex gap-4">
                <div className="rounded-full w-10 h-10 security-gradient flex-shrink-0 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-lg group-hover:text-pistachio transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  <div className="mt-3 flex items-center text-sm font-medium text-pistachio">
                    Learn more
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
