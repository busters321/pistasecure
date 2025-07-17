import { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

export default function Home() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {isMounted ? (
                <>
                    <Header />
                    <main className="flex-grow">
                        <Hero />
                        <Features />
                    </main>
                    <Footer />
                </>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    Loading PistaSecure...
                </div>
            )}
        </div>
    );
}