
import { Heart, Shield } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border/40 py-8 mt-8">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Shield className="h-5 w-5 text-pistachio" />
            <span className="text-lg font-medium">
              Pista<span className="text-pistachio">Secure</span>
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground order-3 md:order-2 mt-6 md:mt-0">
            © {currentYear} PistaSecure. All rights reserved.
          </div>
          
          <div className="flex gap-6 order-2 md:order-3">
            <a href="#" className="text-sm hover:text-pistachio">Terms</a>
            <a href="#" className="text-sm hover:text-pistachio">Privacy</a>
            <a href="#" className="text-sm hover:text-pistachio">Contact</a>
          </div>
        </div>
        
        <div className="border-t border-border/40 mt-6 pt-6 flex justify-center">
          <div className="text-xs flex items-center text-muted-foreground">
            Made with <Heart className="mx-1 h-3 w-3 text-danger" /> by PistaSecure Team
          </div>
        </div>
      </div>
    </footer>
  );
}
