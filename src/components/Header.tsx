
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isLoggedIn = localStorage.getItem("pistaSecure_isLoggedIn") === "true";
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("pistaSecure_isLoggedIn");
    localStorage.removeItem("pistaSecure_userEmail");
    // Don't remove IP info for tracking purposes
    window.location.href = "/";
  };
  
  // Hide the header on the sign-up page
  if (location.pathname === "/signup") return null;
  
  // Hide the header on the login page
  if (location.pathname === "/login") return null;
  
  // Don't show the header on admin pages
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-pistachio" />
          <span className="text-xl font-bold">
            Pista<span className="text-pistachio">Secure</span>
          </span>
        </Link>
        
        <div className="ml-auto flex items-center gap-4">
          {isMobile ? (
            <>
              <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              {isMenuOpen && (
                <div className="absolute top-16 left-0 right-0 border-b border-border/40 bg-background/95 backdrop-blur-md p-4 flex flex-col gap-2">
                  <Link to="/" className="px-4 py-2 hover:bg-muted rounded" onClick={toggleMenu}>Home</Link>
                  
                  {isLoggedIn ? (
                    <>
                      <Link to="/dashboard" className="px-4 py-2 hover:bg-muted rounded" onClick={toggleMenu}>Dashboard</Link>
                      <Button variant="destructive" className="mt-2" onClick={handleLogout}>
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/signup" className="px-4 py-2 hover:bg-muted rounded" onClick={toggleMenu}>
                        Sign Up
                      </Link>
                      <Link to="/login" className="mt-2">
                        <Button className="w-full bg-pistachio hover:bg-pistachio-dark text-black">
                          Log in
                        </Button>
                      </Link>
                    </>
                  )}
                  <div className="mt-4 flex justify-between">
                    <Link to="/admin" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                      <Settings className="h-4 w-4" />
                      Admin
                    </Link>
                    <ThemeToggle />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  {isLoggedIn && (
                    <NavigationMenuItem>
                      <Link to="/dashboard">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          Dashboard
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
              
              <div className="hidden md:flex items-center gap-2">
                {isLoggedIn ? (
                  <Button variant="destructive" onClick={handleLogout}>Log out</Button>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button variant="outline">Sign Up</Button>
                    </Link>
                    <Link to="/login">
                      <Button className="bg-pistachio hover:bg-pistachio-dark text-black">
                        Log in
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2 ml-2">
                <Link to="/admin" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  <Settings className="h-4 w-4" />
                  Admin
                </Link>
                <ThemeToggle />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
