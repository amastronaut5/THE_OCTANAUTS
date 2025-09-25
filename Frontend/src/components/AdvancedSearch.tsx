import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Download, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchFilters {
  species: string;
  location: string;
  depthRange: [number, number];
  temperatureRange: [number, number];
  dateRange: {
    start: string;
    end: string;
  };
  conservationStatus: string[];
  categories: string[];
}

const AdvancedSearch = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<SearchFilters>({
    species: "",
    location: "",
    depthRange: [0, 2000],
    temperatureRange: [-2, 30],
    dateRange: {
      start: "",
      end: ""
    },
    conservationStatus: [],
    categories: []
  });

  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const conservationStatuses = [
    "Least Concern", "Near Threatened", "Vulnerable", 
    "Endangered", "Critically Endangered", "Extinct"
  ];

  const categories = [
    "Pelagic Fish", "Demersal Fish", "Reef Fish", "Cartilaginous Fish",
    "Marine Mammals", "Crustaceans", "Mollusks", "Cnidarians"
  ];

  const mockResults = [
    {
      id: 1,
      species: "Bluefin Tuna",
      scientificName: "Thunnus thynnus",
      location: "North Atlantic",
      depth: 150,
      temperature: 18.5,
      status: "Endangered",
      category: "Pelagic Fish",
      lastSeen: "2024-01-15",
      coordinates: { lat: 42.5, lng: -70.2 }
    },
    {
      id: 2,
      species: "Great White Shark",
      scientificName: "Carcharodon carcharias",
      location: "Pacific Coast",
      depth: 80,
      temperature: 16.2,
      status: "Vulnerable",
      category: "Cartilaginous Fish",
      lastSeen: "2024-01-12",
      coordinates: { lat: 36.7, lng: -121.8 }
    },
    {
      id: 3,
      species: "Coral Trout",
      scientificName: "Plectropomus leopardus",
      location: "Great Barrier Reef",
      depth: 25,
      temperature: 24.1,
      status: "Near Threatened",
      category: "Reef Fish",
      lastSeen: "2024-01-10",
      coordinates: { lat: -16.3, lng: 145.8 }
    }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      // Filter mock results based on criteria
      let filteredResults = mockResults.filter(result => {
        const matchesSpecies = !filters.species || 
          result.species.toLowerCase().includes(filters.species.toLowerCase()) ||
          result.scientificName.toLowerCase().includes(filters.species.toLowerCase());
        
        const matchesLocation = !filters.location || 
          result.location.toLowerCase().includes(filters.location.toLowerCase());
        
        const matchesDepth = result.depth >= filters.depthRange[0] && 
          result.depth <= filters.depthRange[1];
        
        const matchesTemp = result.temperature >= filters.temperatureRange[0] && 
          result.temperature <= filters.temperatureRange[1];
        
        const matchesStatus = filters.conservationStatus.length === 0 || 
          filters.conservationStatus.includes(result.status);
        
        const matchesCategory = filters.categories.length === 0 || 
          filters.categories.includes(result.category);

        return matchesSpecies && matchesLocation && matchesDepth && 
               matchesTemp && matchesStatus && matchesCategory;
      });

      setResults(filteredResults);
      setIsSearching(false);
      
      toast({
        title: "Search completed",
        description: `Found ${filteredResults.length} matching records.`
      });
    }, 1500);
  };

  const handleStatusToggle = (status: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      conservationStatus: checked
        ? [...prev.conservationStatus, status]
        : prev.conservationStatus.filter(s => s !== status)
    }));
  };

  const handleCategoryToggle = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const exportResults = () => {
    if (results.length === 0) {
      toast({
        title: "No data to export",
        description: "Please perform a search first to get results.",
        variant: "destructive"
      });
      return;
    }

    const csvContent = [
      "Species,Scientific Name,Location,Depth (m),Temperature (°C),Conservation Status,Category,Last Seen,Latitude,Longitude",
      ...results.map(r => 
        `"${r.species}","${r.scientificName}","${r.location}",${r.depth},${r.temperature},"${r.status}","${r.category}","${r.lastSeen}",${r.coordinates.lat},${r.coordinates.lng}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marine_search_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export successful",
      description: `Downloaded ${results.length} records as CSV.`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critically Endangered': case 'Endangered': return 'bg-red-100 text-red-800';
      case 'Vulnerable': case 'Near Threatened': return 'bg-yellow-100 text-yellow-800';
      case 'Least Concern': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Advanced Search Filters
          </CardTitle>
          <CardDescription>
            Use multiple criteria to find specific marine species data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Search Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="species-search">Species Name</Label>
              <Input
                id="species-search"
                placeholder="e.g., Bluefin Tuna, Thunnus thynnus"
                value={filters.species}
                onChange={(e) => setFilters(prev => ({ ...prev, species: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location-search">Location</Label>
              <Input
                id="location-search"
                placeholder="e.g., Pacific Ocean, Coral Reef"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          {/* Range Filters */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Depth Range: {filters.depthRange[0]}m - {filters.depthRange[1]}m</Label>
              <Slider
                value={filters.depthRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, depthRange: value as [number, number] }))}
                max={2000}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Label>Temperature Range: {filters.temperatureRange[0]}°C - {filters.temperatureRange[1]}°C</Label>
              <Slider
                value={filters.temperatureRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, temperatureRange: value as [number, number] }))}
                max={30}
                min={-2}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
              />
            </div>
          </div>

          {/* Conservation Status */}
          <div className="space-y-3">
            <Label>Conservation Status</Label>
            <div className="grid grid-cols-3 gap-3">
              {conservationStatuses.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.conservationStatus.includes(status)}
                    onCheckedChange={(checked) => handleStatusToggle(status, checked as boolean)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm">{status}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label>Species Categories</Label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryToggle(category, checked as boolean)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm">{category}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSearch} 
            className="w-full bg-gradient-ocean" 
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <Search className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Database
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Search Results ({results.length})</CardTitle>
                <CardDescription>Marine species matching your criteria</CardDescription>
              </div>
              <Button onClick={exportResults} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{result.species}</h3>
                      <p className="text-sm text-muted-foreground italic">{result.scientificName}</p>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{result.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{result.lastSeen}</span>
                    </div>
                    <div>
                      <span className="font-medium">Depth:</span> {result.depth}m
                    </div>
                    <div>
                      <span className="font-medium">Temp:</span> {result.temperature}°C
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <Badge variant="outline" className="text-xs">
                      {result.category}
                    </Badge>
                    <span className="ml-2 text-xs text-muted-foreground">
                      Coordinates: {result.coordinates.lat}, {result.coordinates.lng}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearch;