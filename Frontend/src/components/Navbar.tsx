import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Waves, Database, BarChart3, Brain, Info, Home, FileText, User, Search } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Upload Data", path: "/upload", icon: Database },
    { name: "Visualization", path: "/visualization", icon: BarChart3 },
    { name: "AI Tools", path: "/ai-tools", icon: Brain },
    { name: "Search", path: "/search", icon: Search },
    { name: "Dashboard", path: "/dashboard", icon: User },
    { name: "API Docs", path: "/api-docs", icon: FileText },
    { name: "About", path: "/about", icon: Info },
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Waves className="h-8 w-8 text-primary animate-wave" />
            <span className="text-xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
              Marine Data Platform
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    size="sm"
                    className={location.pathname === item.path ? "bg-gradient-ocean" : ""}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu would go here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;