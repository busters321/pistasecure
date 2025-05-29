import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

const About = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">About PistaSecure</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Founder Section */}
                    <Card className="hover:shadow-md transition-all">
                        <CardHeader className="pb-2 flex flex-col items-center text-center">
                            <img
                                src="https://media.licdn.com/dms/image/v2/D4E03AQEauaNOHcaxdw/profile-displayphoto-shrink_200_200/B4EZTbcWK4GgAY-/0/1738848430660?e=1753920000&v=beta&t=oBpUxgwqVUg6Vz9eH3bxnnAnkfj3ahJYBNPmoAg5CLE"
                                alt="Ayman Fostok"
                                className="w-20 h-20 rounded-full mb-4"
                            />
                            <CardTitle className="text-xl">Ayman Fostok</CardTitle>
                            <CardDescription>Founder & CEO</CardDescription>
                        </CardHeader>
                        <CardContent className="text-muted-foreground space-y-2">
                            <p>
                                Ayman Fostok is the founder and CEO of PistaSecure. He is a
                                cybersecurity developer, fraud investigator, and product
                                designer.
                            </p>
                            <p>
                                Ayman built PistaSecure to help everyday users stay safe online
                                using tools powered by AI. He created features like scam
                                detection, email security, password risk checks, and a
                                cybersecurity chat assistant.
                            </p>
                            <p>
                                He leads product design, development, and strategy. Ayman is
                                passionate about building clean, user-friendly tools that solve
                                real-world problems.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Co-CEO Section */}
                    <Card className="hover:shadow-md transition-all">
                        <CardHeader className="pb-2 flex flex-col items-center text-center">
                            <img
                                src="https://your-image-url.com/omar.jpg" // replace later
                                alt="Omar Fostok"
                                className="w-20 h-20 rounded-full mb-4"
                            />
                            <CardTitle className="text-xl">Omar Fostok</CardTitle>
                            <CardDescription>CEO</CardDescription>
                        </CardHeader>
                        <CardContent className="text-muted-foreground space-y-2">
                            <p>
                                Omar Fostok is the CEO of PistaSecure. He helps guide the
                                company’s direction, growth, and decision-making. He supports
                                product vision and business operations alongside Ayman.
                            </p>
                            <p>
                                You can edit this section to add more details about Omar’s role,
                                skills, or background.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Mission Section */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
                    <p className="text-muted-foreground">
                        At PistaSecure, our mission is to protect individuals from cyber
                        threats by offering AI-powered security tools. We believe everyone
                        deserves simple, fast, and effective online protection — whether
                        you’re checking a suspicious email, verifying a link, or looking for
                        real-time scam insights.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default About;
