
import { useState } from "react";
import { Shield, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { SignUpForm } from "@/components/SignUpForm";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    agreeToTerms: false
  });
  
  const handleComplete = () => {
    toast({
      title: "Account created!",
      description: "Welcome to PistaSecure. Your account has been successfully created.",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-pistachio" />
            <span className="text-xl font-bold">
              Pista<span className="text-pistachio">Secure</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
                <p className="text-muted-foreground">Get started with PistaSecure by creating an account.</p>
              </div>
              
              <SignUpForm 
                formData={formData}
                setFormData={setFormData}
                onSubmit={() => setStep(2)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-pistachio/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-pistachio" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Account created!</h1>
                <p className="text-muted-foreground">Your PistaSecure account has been successfully created.</p>
              </div>
              <Button 
                className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
                onClick={handleComplete}
              >
                Continue to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
