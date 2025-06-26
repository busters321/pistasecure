import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Billing = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-10 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Choose a Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="border p-4 rounded">
                            <h3 className="text-xl font-bold mb-1">Free Plan</h3>
                            <p className="text-sm text-muted-foreground mb-3">Basic access with limited features</p>
                            <Button variant="outline" disabled>Current Plan</Button>
                        </div>

                        <div className="border p-4 rounded">
                            <h3 className="text-xl font-bold mb-1">Pro Plan - $9.99/mo</h3>
                            <p className="text-sm text-muted-foreground mb-3">Unlock full access to all tools</p>
                            <Button className="bg-pistachio hover:bg-pistachio-dark text-black w-full">
                                Upgrade to Pro
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default Billing;
