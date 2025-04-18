// src/pages/HowItWorks.tsx
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldCheck, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check localStorage for theme preference
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            // Default to system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);

    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/90 pt-8 pb-16">
            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-pistachio/10 blur-3xl"></div>
                <div className="absolute right-0 bottom-0 -z-10 h-[300px] w-[300px] translate-x-1/3 rounded-full bg-pistachio/10 blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white">How PistaSecure Works</h1>
                    <p className="mt-6 max-w-2xl text-lg text-muted-foreground mx-auto">
                        PistaSecure uses advanced AI to protect you from digital threats. We provide real-time security by detecting phishing, scams, and more, while keeping your data safe.
                    </p>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 max-w-3xl mx-auto">
                        {[
                            { icon: ShieldCheck, label: "AI Scam Detection", description: "Our AI instantly detects and stops scams before they can harm you." },
                            { icon: Shield, label: "Link Protection", description: "Check any URL for safety with our AI-powered scanning." },
                            { icon: Shield, label: "Privacy Shield", description: "Keep your sensitive data safe from hackers and malicious attempts." },
                        ].map((feature, i) => (
                            <div key={i} className="p-6 bg-background/50 rounded-lg shadow-lg backdrop-blur-sm">
                                <div className="rounded-full w-16 h-16 mb-4 bg-pistachio/10 flex items-center justify-center">
                                    <feature.icon className="h-8 w-8 text-pistachio" />
                                </div>
                                <h3 className="font-semibold text-xl text-white">{feature.label}</h3>
                                <p className="mt-2 text-lg text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10">
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
                            onClick={() => navigate('/')}
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
