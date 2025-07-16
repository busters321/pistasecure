import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    MessageCircle,
    User,
    Bot,
    Send,
    Link,
    Shield,
    AlertTriangle,
    Copy,
    Check,
    Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/contexts/AuthContext";

type Message = {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
};

type SuggestionTopic = {
    label: string;
    message: string;
    icon: React.ElementType;
};

const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: "sk-caed586daa6f4454a10702d96e675728",
    dangerouslyAllowBrowser: true
});

export default function CyberCopilot() {
    const { isActive } = useAuth();
    const navigate = useNavigate();

    if (!isActive) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="rounded-full p-2 bg-pistachio/10">
                                <MessageCircle className="h-6 w-6 text-pistachio" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Cyber Copilot</h1>
                                <p className="text-muted-foreground">
                                    Your AI security assistant
                                </p>
                            </div>
                        </div>

                        <Card className="p-8 text-center">
                            <div className="flex flex-col items-center space-y-4">
                                <Lock className="h-10 w-10 text-pistachio" />
                                <h2 className="text-2xl font-semibold">Pro Feature Locked</h2>
                                <p className="text-muted-foreground max-w-md">
                                    Cyber Copilot is a premium AI tool that helps you detect scams,
                                    check links, and stay safe online. To use it, activate your subscription.
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

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            content:
                "Hello! I'm your Cyber Copilot. How can I help you with online security today?",
            sender: "ai",
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const suggestions: SuggestionTopic[] = [
        {
            label: "Check a link",
            message: "Is this link safe? https://bit.ly/3xR5tZq",
            icon: Link
        },
        {
            label: "Identify a scam",
            message: "I received an email claiming I won a prize. Is this a scam?",
            icon: AlertTriangle
        },
        {
            label: "Password advice",
            message: "How can I create stronger passwords?",
            icon: Shield
        }
    ];

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth"
        });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg: Message = {
            id: Date.now().toString(),
            content: input,
            sender: "user",
            timestamp: new Date()
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await openai.chat.completions.create({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "You are Cyber Copilot, a helpful cybersecurity assistant."
                    },
                    { role: "user", content: userMsg.content }
                ]
            });
            const aiText =
                res.choices[0]?.message?.content?.trim() ||
                "Sorry, I couldn't process that.";
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                content: aiText,
                sender: "ai",
                timestamp: new Date()
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate AI response");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestion = (msg: string) => setInput(msg);
    const handleCopy = (id: string) => {
        const m = messages.find((x) => x.id === id);
        if (!m) return;
        navigator.clipboard.writeText(m.content);
        setCopiedId(id);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };
    const goTo = (path: string) => {
        navigate(path);
        toast.success("Opening tool...");
    };

    const renderMessage = (m: Message) => {
        const md = (
            <div className="whitespace-pre-wrap break-words max-w-full">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                </ReactMarkdown>
            </div>
        );
        if (m.sender === "user") return md;
        return (
            <>
                {md}
                <div className="mt-2 flex flex-wrap gap-2">
                    {/(link inspection|check.*link|analyze.*url)/i.test(m.content) && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-pistachio text-pistachio"
                            onClick={() => goTo("/link-inspection")}
                        >
                            <Link className="h-3 w-3 mr-1" /> Link Inspector
                        </Button>
                    )}
                    {/(scam intelligence|scan for scam)/i.test(m.content) && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-pistachio text-pistachio"
                            onClick={() => goTo("/scam-intelligence")}
                        >
                            <Shield className="h-3 w-3 mr-1" /> Scan Scams
                        </Button>
                    )}
                    {/(password|check.*password)/i.test(m.content) && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-pistachio text-pistachio"
                            onClick={() => goTo("/password-checker")}
                        >
                            <Shield className="h-3 w-3 mr-1" /> Check Password
                        </Button>
                    )}
                    {/(safeview|browse)/i.test(m.content) && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-pistachio text-pistachio"
                            onClick={() => goTo("/safe-view")}
                        >
                            <Shield className="h-3 w-3 mr-1" /> SafeView
                        </Button>
                    )}
                    {/(social media|fake profile)/i.test(m.content) && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-pistachio text-pistachio"
                            onClick={() => goTo("/social-protection")}
                        >
                            <Shield className="h-3 w-3 mr-1" /> Social Protect
                        </Button>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="rounded-full p-2 bg-pistachio/10">
                            <MessageCircle className="h-6 w-6 text-pistachio" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Cyber Copilot</h1>
                            <p className="text-muted-foreground">
                                Your AI security assistant
                            </p>
                        </div>
                    </div>

                    <Card className="h-[600px]">
                        <div className="flex flex-col h-full">
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto px-6 pt-6 space-y-4"
                            >
                                {messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`flex gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"
                                                }`}
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${m.sender === "user"
                                                    ? "bg-pistachio/20"
                                                    : "bg-secondary"
                                                    }`}
                                            >
                                                {m.sender === "user" ? (
                                                    <User className="h-4 w-4 text-pistachio" />
                                                ) : (
                                                    <Bot className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div className="relative group">
                                                <div
                                                    className={`p-3 rounded-lg ${m.sender === "user"
                                                        ? "bg-pistachio text-black"
                                                        : "bg-secondary"
                                                        }`}
                                                >
                                                    {renderMessage(m)}
                                                </div>
                                                {m.sender === "ai" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute -right-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => handleCopy(m.id)}
                                                    >
                                                        {copiedId === m.id ? (
                                                            <Check className="h-4 w-4 text-success" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                                <Bot className="h-4 w-4" />
                                            </div>
                                            <div className="p-3 rounded-lg bg-secondary flex items-center">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                                                    <div
                                                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                                                        style={{ animationDelay: "0.2s" }}
                                                    />
                                                    <div
                                                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                                                        style={{ animationDelay: "0.4s" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="px-6 pb-6">
                                {messages.length === 1 && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                                        {suggestions.map((s, i) => (
                                            <Button
                                                key={i}
                                                variant="outline"
                                                className="flex items-center gap-2 py-6"
                                                onClick={() => handleSuggestion(s.message)}
                                            >
                                                <div className="rounded-full p-1.5 bg-pistachio/10">
                                                    <s.icon className="h-4 w-4 text-pistachio" />
                                                </div>
                                                <span>{s.label}</span>
                                            </Button>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2 items-center">
                                    <Input
                                        placeholder="Type your security question here…"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        disabled={isLoading}
                                        className="flex-grow"
                                    />
                                    <Button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                        className="bg-pistachio hover:bg-pistachio-dark text-black"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
