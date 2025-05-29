
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { FeatureAccessProvider } from "./contexts/FeatureAccessContext";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ScamIntelligence from "./pages/ScamIntelligence";
import LinkInspection from "./pages/LinkInspection";
import EmailScanner from "./pages/EmailScanner";
import CyberCopilot from "./pages/CyberCopilot";
import SafeViewBrowser from "./pages/SafeViewBrowser";
import SocialMediaProtection from "./pages/SocialMediaProtection";
import PasswordChecker from "./pages/PasswordChecker";
import ScamReport from "./pages/ScamReport";
import ThreatFeed from "./pages/ThreatFeed";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import HowItWorks from './pages/HowItWorks';
import About from "./pages/About";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminAuthProvider>
          <FeatureAccessProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scam-intelligence" element={<ScamIntelligence />} />
              <Route path="/link-inspection" element={<LinkInspection />} />
              <Route path="/email-scanner" element={<EmailScanner />} />
              <Route path="/cyber-copilot" element={<CyberCopilot />} />
              <Route path="/safe-view" element={<SafeViewBrowser />} />
              <Route path="/social-protection" element={<SocialMediaProtection />} />
              <Route path="/password-checker" element={<PasswordChecker />} />
              <Route path="/scam-report" element={<ScamReport />} />
              <Route path="/threat-feed" element={<ThreatFeed />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </FeatureAccessProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
