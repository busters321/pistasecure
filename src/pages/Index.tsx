import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ScamIntelligenceEngine } from "@/components/ScamIntelligenceEngine";
import { Footer } from "@/components/Footer";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Hero />
                <Features />
                <ScamIntelligenceEngine />
            </main>
            <Footer />
        </div>
    );
}
