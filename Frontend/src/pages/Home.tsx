import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Upload, BarChart3, Brain, Github, Mail, Info, User } from "lucide-react";
import heroImage from "@/assets/hero-marine.jpg";

const Home = () => {
  const features = [
    {
      icon: Upload,
      title: "Upload Datasets",
      description: "Support for CSV, JSON, and FASTA file formats with instant preview and validation."
    },
    {
      icon: BarChart3,
      title: "Visualize Trends", 
      description: "Interactive charts and graphs to explore species distribution and abundance over time."
    },
    {
      icon: Brain,
      title: "AI-Based Search",
      description: "Advanced species classification and intelligent search powered by machine learning."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center text-white z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float">
            AI-Powered Marine Data Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Upload, Integrate & Visualize Ocean Biodiversity Data
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload">
              <Button size="lg" className="bg-gradient-ocean hover:opacity-90 text-lg px-8 py-4">
                Get Started
              </Button>
            </Link>
            <Link to="/upload">
              <Button size="lg" variant="hero" className="text-lg px-8 py-4">
                Upload Data
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Animated wave overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Live Data and Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Platform Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for marine researchers and data scientists
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Feature Cards */}
            <div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-card/50 backdrop-blur">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-4 bg-gradient-ocean rounded-full w-fit group-hover:animate-pulse">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Quick Access Dashboard Link */}
          <div className="text-center mt-12">
            <Card className="max-w-md mx-auto bg-gradient-to-r from-primary/10 to-accent/10">
              <CardContent className="pt-6">
                <User className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">User Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Manage your research data, settings, and favorite species
                </p>
                <Link to="/dashboard">
                  <Button className="bg-gradient-ocean">
                    Access Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

            
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-around items-center gap-12 text-center">
             {/* <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <div className="flex items-center justify-center md:justify-start mb-2">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@marinedata.org</span>
              </div>
            </div> */}
            <div>
              <h3 className="text-xl font-semibold mb-4">About</h3>
              <Link to="/about" className="hover:text-primary-glow transition-colors">
                <div className="flex items-center justify-center">
                  <Info className="h-4 w-4 mr-2" />
                  <span>Learn More</span>
                </div>
              </Link>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">GitHub</h3>
              <a href="https://github.com/amastronaut5/THE_OCTANAUTS" target="_blank" className="hover:text-primary-glow transition-colors">
                <div className="flex items-center justify-center">
                  <Github className="h-4 w-4 mr-2" />
                  <span>View Source Code</span>
                </div>
              </a>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-primary-foreground/20">
            <p>&copy; 2024 Marine Data Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
// ...existing code...
    </div>
  );
};

export default Home;