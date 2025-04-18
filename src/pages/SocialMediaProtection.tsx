import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SocialMediaProtection() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
                <div className="text-center space-y-6">
                    <h1 className="text-5xl font-bold text-pistachio">
                        Social Media Protection
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Coming Soon
                    </p>
                    <div className="inline-block rounded-full bg-pistachio px-6 py-3 text-black font-medium opacity-80 cursor-not-allowed hover:opacity-100 transition">
                        Stay Tuned
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
