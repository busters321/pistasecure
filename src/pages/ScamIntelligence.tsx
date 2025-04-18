
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScamIntelligenceEngine } from "@/components/ScamIntelligenceEngine";

const ScamIntelligence = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">AI Scam Intelligence</h1>
          <p className="text-muted-foreground mb-8">
            Analyze messages, links, or images to instantly detect and protect against digital scams.
          </p>
          <ScamIntelligenceEngine />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScamIntelligence;
