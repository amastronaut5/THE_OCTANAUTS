import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Search, Upload, BarChart3 } from "lucide-react";

const APIDocs = () => {
  const endpoints = [
    {
      method: "POST",
      endpoint: "/api/upload",
      description: "Upload marine species data (CSV, JSON, FASTA)",
      icon: Upload,
      params: [
        { name: "file", type: "File", required: true, description: "Data file to upload" },
        { name: "format", type: "string", required: true, description: "File format (csv/json/fasta)" }
      ],
      response: {
        success: "{ \"message\": \"Data uploaded successfully\", \"records\": 150 }",
        error: "{ \"error\": \"Invalid file format\" }"
      }
    },
    {
      method: "GET",
      endpoint: "/api/data/species",
      description: "Retrieve species data for visualization",
      icon: Database,
      params: [
        { name: "limit", type: "number", required: false, description: "Number of records to return" },
        { name: "offset", type: "number", required: false, description: "Pagination offset" }
      ],
      response: {
        success: "{ \"data\": [...], \"total\": 150, \"page\": 1 }"
      }
    },
    {
      method: "POST",
      endpoint: "/api/classify",
      description: "Classify marine species using AI",
      icon: Search,
      params: [
        { name: "speciesName", type: "string", required: true, description: "Scientific name of species" },
        { name: "characteristics", type: "array", required: false, description: "Additional characteristics" }
      ],
      response: {
        success: "{ \"category\": \"Pelagic Fish\", \"confidence\": 0.95, \"description\": \"...\" }"
      }
    },
    {
      method: "GET",
      endpoint: "/api/search",
      description: "Search species by keyword or characteristics",
      icon: Search,
      params: [
        { name: "q", type: "string", required: true, description: "Search query" },
        { name: "category", type: "string", required: false, description: "Filter by category" }
      ],
      response: {
        success: "{ \"results\": [...], \"count\": 25 }"
      }
    },
    {
      method: "GET",
      endpoint: "/api/analytics",
      description: "Get data analytics and statistics",
      icon: BarChart3,
      params: [
        { name: "timeframe", type: "string", required: false, description: "Time period (daily/monthly/yearly)" },
        { name: "groupBy", type: "string", required: false, description: "Group results by field" }
      ],
      response: {
        success: "{ \"stats\": {...}, \"trends\": [...], \"distribution\": {...} }"
      }
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-ocean bg-clip-text text-transparent">
            API Documentation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete reference for the Marine Data Platform API endpoints. 
            Build integrations and access marine species data programmatically.
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Getting Started
              </CardTitle>
              <CardDescription>
                Base URL: <code className="bg-muted px-2 py-1 rounded">https://api.marinedata.platform</code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-2">Include your API key in the request headers:</p>
                  <code className="block bg-muted p-3 rounded text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Content Type</h4>
                  <code className="block bg-muted p-3 rounded text-sm">
                    Content-Type: application/json
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Endpoints</h2>
          
          {endpoints.map((endpoint, index) => {
            const Icon = endpoint.icon;
            return (
              <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <code className="text-lg">{endpoint.endpoint}</code>
                    </CardTitle>
                    <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                      {endpoint.method}
                    </Badge>
                  </div>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Parameters</h4>
                      <div className="space-y-3">
                        {endpoint.params.map((param, paramIndex) => (
                          <div key={paramIndex} className="border border-border/30 rounded p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="text-sm font-medium">{param.name}</code>
                              <Badge variant="outline" className="text-xs">
                                {param.type}
                              </Badge>
                              {param.required && (
                                <Badge variant="destructive" className="text-xs">
                                  required
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{param.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Response</h4>
                      <div className="space-y-3">
                        <div>
                          <Badge className="mb-2 text-xs">200 Success</Badge>
                          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                            {endpoint.response.success}
                          </pre>
                        </div>
                        {endpoint.response.error && (
                          <div>
                            <Badge variant="destructive" className="mb-2 text-xs">400 Error</Badge>
                            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                              {endpoint.response.error}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block">
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Contact our support team for API access and integration assistance.
              </p>
              <code className="text-sm bg-muted px-3 py-1 rounded">
                support@marinedata.platform
              </code>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default APIDocs;