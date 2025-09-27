import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Search, Upload, Fish, Zap, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

const AITools = () => {
  const [speciesName, setSpeciesName] = useState("");
  const [classification, setClassification] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock classification data
  const classificationTypes = {
    "bluefin tuna": "Pelagic Fish - Open ocean swimmer, highly migratory",
    "great white shark": "Pelagic Predator - Top-level marine predator",
    "clownfish": "Reef Fish - Coral reef dwelling species",
    "flounder": "Demersal Fish - Bottom-dwelling flatfish",
    "cod": "Demersal Fish - Bottom-feeding commercial fish",
    "salmon": "Anadromous Fish - Migrates between fresh and salt water",
  };

  const handleClassification = async () => {
    if (!speciesName.trim()) {
      toast({
        title: "Missing input",
        description: "Please enter a species name for classification.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const result = classificationTypes[speciesName.toLowerCase()] || 
        "Unknown Species - Please verify the species name or add it to the database";
      setClassification(result);
      setIsLoading(false);
      
      toast({
        title: "Classification complete",
        description: "AI analysis has been generated for your species."
      });
    }, 1500);
  };

 const handleSearch = async () => {
  if (!searchQuery.trim()) {
    toast({
      title: "Missing search query",
      description: "Please enter a search term.",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);

  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/record/scientific/${encodeURIComponent(searchQuery)}`,
      {
        headers: {
          Authorization: "Bearer mysecrettoken", // match your backend auth
        },
      }
    );

    setSearchResults(res.data);

    toast({
      title: "Search complete",
      description: `Found ${res.data.length} matching records.`,
    });
  } catch (err: any) {
    console.error(err);
    toast({
      title: "Search failed",
      description: err.response?.data?.error || err.message,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  const handleDownload = () => {
    if (searchResults.length === 0) {
      toast({
        title: "No data to download",
        description: "Please perform a search first to get results.",
        variant: "destructive"
      });
      return;
    }

    const csvContent = [
      "Name,Category,Habitat,Status",
      ...searchResults.map(species => 
        `"${species.name}","${species.category}","${species.habitat}","${species.status}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marine_species_search_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Download successful",
      description: `Downloaded ${searchResults.length} species records as CSV.`
    });
  };

  const handleOtolithUpload = () => {
    toast({
      title: "Feature coming soon",
      description: "Otolith image classification will be available in the next update."
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-ocean bg-clip-text text-transparent">
            AI-Powered Marine Tools
          </h1>
          <p className="text-xl text-muted-foreground">
            Advanced species classification and intelligent search capabilities
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Species Classification Tool */}
          <Card className="bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                Species Classification
              </CardTitle>
              <CardDescription>
                Enter a species name to get AI-powered classification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="species">Species Name</Label>
                <Input
                  id="species"
                  placeholder="e.g., Bluefin Tuna, Great White Shark"
                  value={speciesName}
                  onChange={(e) => setSpeciesName(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleClassification}
                className="w-full bg-gradient-ocean"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Fish className="h-4 w-4 mr-2" />
                    Classify Species
                  </>
                )}
              </Button>

              {classification && (
                <div className="mt-4 p-4 bg-secondary/50 rounded-lg border-l-4 border-primary">
                  <h4 className="font-semibold mb-2">Classification Result:</h4>
                  <p className="text-sm">{classification}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Species Search Tool */}
          <Card className="bg-gradient-to-br from-background to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-primary" />
                Intelligent Species Search
              </CardTitle>
              <CardDescription>
                Search the marine species database by name, category, or habitat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Query</Label>
                <Input
                  id="search"
                  placeholder="e.g., tuna, reef fish, pacific"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-primary to-accent"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Database
                  </>
                )}
              </Button>

              {searchResults.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Search Results ({searchResults.length})</h4>
                    <Button 
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download CSV
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {searchResults.map((record, index) => (
                      <div key={index} className="p-3 bg-card rounded-lg border">
                        <h4 className="font-semibold">{record.scientificName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {record.institutionCode} · {record.collectionCode}
                        </p>
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          <p><strong>Habitat:</strong> {record.habitat || "N/A"}</p>
                          <p><strong>Water Body:</strong> {record.waterBody || "N/A"}</p>
                          <p><strong>Country:</strong> {record.country || "N/A"}</p>
                          <p><strong>Locality:</strong> {record.locality || "N/A"}</p>
                          <p><strong>Depth:</strong> {record.minimumDepthInMeters}–{record.maximumDepthInMeters} m</p>
                          <p><strong>Identified By:</strong> {record.identifiedBy || "Unknown"}</p>
                          <p><strong>Date Identified:</strong> {record.dateIdentified || "N/A"}</p>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Otolith Analysis Tool (Coming Soon) */}
        <Card className="mt-6 bg-gradient-to-br from-background to-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2 text-primary" />
              Otolith Image Analysis
              <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                Coming Soon
              </span>
            </CardTitle>
            <CardDescription>
              Upload otolith images for AI-powered species identification and age estimation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-2">Otolith Image Upload</p>
              <p className="text-sm text-muted-foreground mb-4">
                This feature will support JPG, PNG, and TIFF formats
              </p>
              <Button onClick={handleOtolithUpload} variant="outline" disabled>
                Upload Otolith Image
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AITools;