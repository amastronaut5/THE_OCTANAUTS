import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Code, Database, Brain, BarChart3 } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Akshat Mehta",
    },
    {
      name: "Aditi Kapoor",
    },
    {
      name: "Bhumesh Mahajan",
    },
    {
      name: "Divyategpal Singh",
    },
    {
      name: "Hardik Aggarwal",
    },
    {
      name: "Kirandeep Kaur",
    }
  ];

  const techStack = [
    { category: "Frontend", technologies: ["React.js", "TypeScript", "Tailwind CSS", "Chart.js"] },
    { category: "Backend", technologies: ["Node.js", "Express.js", "RESTful APIs"] },
    { category: "Database", technologies: ["PostgreSQL", "VecctorDb"] },
    { category: "AI/ML", technologies: ["HuggingFace API", "TensorFlow", "Natural Language Processing"] },
    { category: "Tools", technologies: ["Git", "Docker", "AWS", "Vite"] }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-ocean bg-clip-text text-transparent">
            About Marine Data Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering marine researchers with AI-driven tools for biodiversity analysis and conservation efforts.
          </p>
        </div>

        {/* Problem Statement */}
        <Card className="mb-8 bg-gradient-to-br from-background to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              The Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base leading-relaxed">
              Marine biodiversity research generates vast amounts of data from various sources - field observations, 
              genetic sequencing, acoustic monitoring, and satellite imagery. However, researchers often struggle with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Fragmented data storage across multiple platforms and formats</li>
              <li>Limited tools for comprehensive data analysis and visualization</li>
              <li>Time-consuming manual species classification and identification</li>
              <li>Difficulty in sharing and collaborating on research findings</li>
            </ul>
            <p className="text-base leading-relaxed font-medium text-primary">
              Our platform addresses these challenges by providing a unified, AI-powered solution for marine data 
              management, analysis, and collaboration.
            </p>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Our Team
            </CardTitle>
            <CardDescription>
              Passionate experts in marine science, technology, and design
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="p-4 rounded-lg bg-secondary/20 border">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2 text-primary" />
              Technology Stack
            </CardTitle>
            <CardDescription>
              Modern, scalable technologies powering our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {techStack.map((stack, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center">
                    {stack.category === "Frontend" && <BarChart3 className="h-4 w-4 mr-2 text-accent" />}
                    {stack.category === "Backend" && <Code className="h-4 w-4 mr-2 text-primary" />}
                    {stack.category === "Database" && <Database className="h-4 w-4 mr-2 text-secondary-foreground" />}
                    {stack.category === "AI/ML" && <Brain className="h-4 w-4 mr-2 text-accent" />}
                    {stack.category === "Tools" && <Target className="h-4 w-4 mr-2 text-muted-foreground" />}
                    <h3 className="font-semibold">{stack.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stack.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mission Statement
        <Card className="bg-gradient-ocean text-white">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              To accelerate marine conservation efforts by providing researchers with powerful, 
              accessible tools for data analysis and collaboration. We believe that by democratizing 
              access to advanced analytical capabilities, we can help protect our oceans for future generations.
            </p>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default About;