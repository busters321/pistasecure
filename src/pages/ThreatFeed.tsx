
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Globe, AlertTriangle, Smartphone, MousePointer, Share2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type ScamCategory = "phishing" | "financial" | "romance" | "impersonation" | "malware";
type ScamPlatform = "email" | "social" | "website" | "messaging" | "phone";

interface ScamThreat {
  id: string;
  title: string;
  description: string;
  category: ScamCategory;
  platform: ScamPlatform;
  region: string;
  impactLevel: number; // 1-5
  reportCount: number;
  date: Date;
  avoidanceSteps: string[];
}

const ThreatFeed = () => {
  const [region, setRegion] = useState<string>("all");
  const [platform, setPlatform] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [threats, setThreats] = useState<ScamThreat[]>([]);
  
  // Generate mock threats on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockThreats: ScamThreat[] = [
        {
          id: "1",
          title: "Amazon Refund Phishing Campaign",
          description: "Scammers are sending fake Amazon order confirmation emails claiming suspicious purchases with instructions to call a number for refunds. The calls lead to requests for remote access to computers and financial details.",
          category: "phishing",
          platform: "email",
          region: "North America",
          impactLevel: 4,
          reportCount: 2356,
          date: new Date(2023, 3, 15),
          avoidanceSteps: [
            "Never call phone numbers from suspicious emails",
            "Check your Amazon account directly through the official app or website",
            "Never provide remote access to your computer based on an unsolicited contact",
            "Report phishing emails to Amazon and delete them"
          ]
        },
        {
          id: "2",
          title: "WhatsApp Account Takeover Scam",
          description: "Attackers are compromising WhatsApp accounts by tricking users into sharing verification codes. They then use the compromised accounts to request money from the victim's contacts.",
          category: "impersonation",
          platform: "messaging",
          region: "Global",
          impactLevel: 5,
          reportCount: 4521,
          date: new Date(2023, 3, 18),
          avoidanceSteps: [
            "Never share WhatsApp verification codes with anyone",
            "Enable two-factor authentication in WhatsApp",
            "Be suspicious if contacts suddenly request money transfers",
            "Report and block suspicious accounts immediately"
          ]
        },
        {
          id: "3",
          title: "Cryptocurrency Investment Scam",
          description: "Fraudulent investment opportunities being promoted on social media promising unrealistic returns on cryptocurrency investments. Victims are directed to fake platforms that steal their investment funds.",
          category: "financial",
          platform: "social",
          region: "Europe",
          impactLevel: 5,
          reportCount: 1823,
          date: new Date(2023, 3, 20),
          avoidanceSteps: [
            "Research investment opportunities thoroughly before committing funds",
            "Be wary of promises of guaranteed high returns",
            "Only use well-established cryptocurrency exchanges",
            "Never invest based solely on social media recommendations"
          ]
        },
        {
          id: "4",
          title: "Romance Scam Targeting Seniors",
          description: "Scammers are creating fake dating profiles targeting seniors, building relationships over months before requesting financial help for fake emergencies.",
          category: "romance",
          platform: "social",
          region: "North America",
          impactLevel: 4,
          reportCount: 976,
          date: new Date(2023, 3, 22),
          avoidanceSteps: [
            "Be cautious of online relationships that develop quickly",
            "Research the person's profile and images using reverse image search",
            "Never send money to someone you haven't met in person",
            "Discuss suspicious contacts with trusted friends or family members"
          ]
        },
        {
          id: "5",
          title: "Fake Banking App Malware",
          description: "Malicious apps mimicking legitimate banking applications are being distributed through third-party app stores. These apps steal login credentials and can intercept SMS verification codes.",
          category: "malware",
          platform: "phone",
          region: "Asia",
          impactLevel: 5,
          reportCount: 3241,
          date: new Date(2023, 3, 25),
          avoidanceSteps: [
            "Only download banking apps from official app stores",
            "Verify app publisher information carefully",
            "Check app reviews and download counts before installing",
            "Use anti-malware protection on mobile devices"
          ]
        },
      ];
      
      setThreats(mockThreats);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter threats based on selected filters and search query
  const filteredThreats = threats.filter(threat => {
    return (
      (region === "all" || threat.region === region) &&
      (platform === "all" || threat.platform === platform) &&
      (category === "all" || threat.category === category) &&
      (
        searchQuery === "" || 
        threat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        threat.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  const getCategoryIcon = (category: ScamCategory) => {
    switch (category) {
      case "phishing": return <Mail className="h-4 w-4" />;
      case "financial": return <AlertTriangle className="h-4 w-4" />;
      case "romance": return <Share2 className="h-4 w-4" />;
      case "impersonation": return <MousePointer className="h-4 w-4" />;
      case "malware": return <Smartphone className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: ScamCategory) => {
    switch (category) {
      case "phishing": return "Phishing";
      case "financial": return "Financial Fraud";
      case "romance": return "Romance Scam";
      case "impersonation": return "Impersonation";
      case "malware": return "Malware";
    }
  };

  const getPlatformLabel = (platform: ScamPlatform) => {
    switch (platform) {
      case "email": return "Email";
      case "social": return "Social Media";
      case "website": return "Website";
      case "messaging": return "Messaging";
      case "phone": return "Phone/SMS";
    }
  };

  const getImpactBadge = (level: number) => {
    const colors = [
      "bg-success/10 text-success",
      "bg-success/10 text-success",
      "bg-warning/10 text-warning",
      "bg-warning/10 text-warning",
      "bg-destructive/10 text-destructive"
    ];
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[level - 1]}`}>
        {level === 1 ? "Very Low" : 
         level === 2 ? "Low" : 
         level === 3 ? "Medium" : 
         level === 4 ? "High" : "Critical"}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full p-2 bg-pistachio/10">
              <BarChart3 className="h-6 w-6 text-pistachio" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Live Threat Feed</h1>
              <p className="text-muted-foreground">
                Track the latest scam trends and security threats in real-time
              </p>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Input
                  placeholder="Search threats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-2"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Region</label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Regions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="North America">North America</SelectItem>
                        <SelectItem value="Europe">Europe</SelectItem>
                        <SelectItem value="Asia">Asia</SelectItem>
                        <SelectItem value="South America">South America</SelectItem>
                        <SelectItem value="Africa">Africa</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Global">Global</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">Platform</label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Platforms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="website">Websites</SelectItem>
                        <SelectItem value="messaging">Messaging Apps</SelectItem>
                        <SelectItem value="phone">Phone/SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="phishing">Phishing</SelectItem>
                        <SelectItem value="financial">Financial Fraud</SelectItem>
                        <SelectItem value="romance">Romance Scams</SelectItem>
                        <SelectItem value="impersonation">Impersonation</SelectItem>
                        <SelectItem value="malware">Malware</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="h-8 w-8 border-2 border-pistachio border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredThreats.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No threats match your filters</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria to find relevant threats
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setRegion("all");
                  setPlatform("all");
                  setCategory("all");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredThreats.map(threat => (
                <Card key={threat.id} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(threat.category)}
                          <span className="text-sm text-muted-foreground">
                            {getCategoryLabel(threat.category)}
                          </span>
                        </div>
                        <CardTitle>{threat.title}</CardTitle>
                      </div>
                      {getImpactBadge(threat.impactLevel)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <Tabs defaultValue="details">
                      <TabsList className="mb-4">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="prevention">Prevention</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="details" className="space-y-4">
                        <p className="text-muted-foreground">
                          {threat.description}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div className="bg-muted p-2 rounded">
                            <p className="font-medium">Platform</p>
                            <p>{getPlatformLabel(threat.platform)}</p>
                          </div>
                          <div className="bg-muted p-2 rounded">
                            <p className="font-medium">Region</p>
                            <p>{threat.region}</p>
                          </div>
                          <div className="bg-muted p-2 rounded">
                            <p className="font-medium">Reports</p>
                            <p>{threat.reportCount.toLocaleString()}</p>
                          </div>
                          <div className="bg-muted p-2 rounded">
                            <p className="font-medium">First Seen</p>
                            <p>{threat.date.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="prevention" className="space-y-4">
                        <h3 className="font-medium">How to Avoid This Threat</h3>
                        <ul className="space-y-2">
                          {threat.avoidanceSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-1 flex-shrink-0 text-xs bg-pistachio text-black w-5 h-5 rounded-full flex items-center justify-center">
                                {i + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex gap-3 mt-4">
                          <Button variant="outline" className="flex-1 text-sm">
                            Report Similar Scam
                          </Button>
                          <Button className="flex-1 text-sm bg-pistachio hover:bg-pistachio-dark text-black">
                            Share Warning
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThreatFeed;
