import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Select from "react-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar} from 'react-chartjs-2';
import { BarChart3} from "lucide-react";
import stationData from "../../data/ocean_locality_map.json";
import speciesData from "../../data/ocean_name_map.json"
import phChloroData from "../../data/phChloroData.json"
import { ChartOptions } from "chart.js";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type Station = typeof stationData[number];
type Species = typeof speciesData[number];
const center: [number, number] = [20.5937, 78.9629];

const IndiaMapStations: React.FC = () => {
  const [selectedStations, setSelectedStations] = useState<Station[]>([]);

  // Default top 7 stations
  const defaultStations = [...stationData].slice(0, 7);

  // Options for Select dropdown
  const localityOptions = Array.from(new Set(stationData.map(s => s.locality.trim())))
    .map(l => ({ value: l, label: l }));

  const handleChange = (selected: any) => {
    const selectedLocalities = selected?.map((s: any) => s.value.trim()) || [];
    const filtered = stationData.filter(s => selectedLocalities.includes(s.locality.trim()));
    setSelectedStations(filtered.slice(0, 12)); // limit to 12 stations
  };

  const [selectedSpecies, setSelectedSpecies] = useState<Species[]>([]);

  // Default top 7 stations
  const defaultSpecies = [...speciesData].slice(0, 7);

  // Options for Select dropdown
  const speciesOptions = Array.from(new Set(speciesData.map(s => s.scientificName.trim())))
    .map(l => ({ value: l, label: l }));

  const handleSpeciesChange = (selected: any) => {
    const selectedSpecies = selected?.map((s: any) => s.value.trim()) || [];
    const filtered = speciesData.filter(s => selectedSpecies.includes(s.scientificName.trim()));
    setSelectedSpecies(filtered.slice(0, 12)); // limit to 12 stations
  };

    const phData = {
        labels: phChloroData.map(d => d.year),
        datasets: [
            {
            label: "pH",
            data: phChloroData.map(d => d.ph),
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            },
        ],
    };

    const chlorophyllData = {
        labels: phChloroData.map(d => d.year),
        datasets: [
            {
            label: "Chlorophyll",
            data: phChloroData.map(d => d.chlorophyll),
            backgroundColor: "rgba(255, 206, 86, 0.5)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
            position: "top" as const,
            },
        },
    };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-ocean bg-clip-text text-transparent">
                    Dive into the Oceanography Insights
                </h1>
                <p className="text-xl text-muted-foreground">
                    Advanced species classification and Intelligent Search Capabilities
                </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="text-center px-6 pt-8 pb-6 bg-gradient-ocean">
                    <h1 className="text-3xl font-bold mb-3 text-white bg-clip-text text-transparent">
                        Explore India’s Marine Stations
                    </h1>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center space-y-6 px-6 py-8">
                {/* Search */}
                    <div className="w-1/2">
                        <Select
                        className="relative z-50"
                        options={localityOptions}
                        isMulti
                        onChange={handleChange}
                        placeholder="Search and select localities..."
                        />
                    </div>

                    {/* Map */}
                    <div className="w-full flex justify-center">
                        <MapContainer
                        {...({
                            center: [20.5937, 78.9629],
                            zoom: 5,
                            style: { height: "500px", width: "70%", margin: "0 auto" },
                        } as any)}
                        className="rounded-xl shadow-md border border-gray-200"
                        >
                        <TileLayer
                            {...({
                            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            attribution: "&copy; OpenStreetMap contributors",
                            } as any)}
                        />

                        {/* Default markers */}
                        {defaultStations.map((station) => (
                            <Marker
                            key={station.id}
                            position={[
                                Number(station.decimalLatitude),
                                Number(station.decimalLongitude),
                            ]}
                            >
                            <Popup>
                                <strong>{station.locality}</strong>
                                <br />
                                Species: {station.scientificName}
                                <br />
                                Depth: {station.minimumDepthInMeters}–
                                {station.maximumDepthInMeters} m
                            </Popup>
                            </Marker>
                        ))}

                        {/* Selected markers */}
                        {selectedStations.map((station) => (
                            <Marker
                            key={station.id}
                            position={[
                                Number(station.decimalLatitude),
                                Number(station.decimalLongitude),
                            ]}
                            >
                            <Popup>
                                <strong>{station.locality}</strong>
                                <br />
                                Species: {station.scientificName}
                                <br />
                                Depth: {station.minimumDepthInMeters}–
                                {station.maximumDepthInMeters} m
                            </Popup>
                            </Marker>
                        ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        
            <br/>
            <br/>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="text-center px-6 pt-8 pb-6 bg-gradient-ocean">
                    <h1 className="text-3xl font-bold mb-3 text-white bg-clip-text text-transparent">
                        Explore India’s Marine Species by Location
                    </h1>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center space-y-6 px-6 py-8">
                    {/* Search */}
                    <div className="w-1/2">
                        <Select
                            className="relative z-50"
                            options={speciesOptions}
                            isMulti
                            onChange={handleSpeciesChange}
                            placeholder="Search and select species..."
                        />
                    </div>

                    {/* Map */}
                    <div className="w-full flex justify-center">
                        <MapContainer
                            {...({
                                center: [20.5937, 78.9629],
                                zoom: 5,
                                style: { height: "500px", width: "70%", margin: "0 auto" },
                            } as any)}
                            className="rounded-xl shadow-md border border-gray-200"
                        >
                            <TileLayer
                                {...({
                                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                                    attribution: "&copy; OpenStreetMap contributors",
                                } as any)}
                            />

                            {/* Default markers */}
                            {defaultSpecies.map(species => (
                                <Marker
                                    key={species.id}
                                    position={[
                                        Number(species.decimalLatitude),
                                        Number(species.decimalLongitude),
                                    ]}
                                >
                                    <Popup>
                                        <strong>{species.scientificName}</strong>
                                        <br />
                                        Scientic Name ID: {species.scientificNameID}
                                        <br />
                                        Location: {species.locality}
                                        <br />
                                        Depth: {species.minimumDepthInMeters}–{species.maximumDepthInMeters} m
                                    </Popup>
                                </Marker>
                            ))}

                            {/* Selected markers */}
                            {selectedSpecies.map(species => (
                                <Marker
                                    key={species.id}
                                    position={[
                                        Number(species.decimalLatitude),
                                        Number(species.decimalLongitude),
                                    ]}
                                >
                                    <Popup>
                                        <strong>{species.scientificName}</strong>
                                        <br />
                                        Scientic Name ID: {species.scientificNameID}
                                        <br />
                                        Location: {species.locality}
                                        <br />
                                        Depth: {species.minimumDepthInMeters}–{species.maximumDepthInMeters} m
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
            <br/>
            <br/>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="text-center px-6 pt-8 pb-6 bg-gradient-ocean">
                    <h1 className="text-3xl font-bold mb-3 text-white bg-clip-text text-transparent">
                        pH and Chlorophyll 
                    </h1>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-background to-secondary/20">
                        <CardHeader>
                        <CardTitle>pH Over Years</CardTitle>
                        <CardDescription>Mean pH per year</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <div className="h-64">
                            <Bar data={phData} options={chartOptions} />
                        </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-background to-secondary/20">
                        <CardHeader>
                        <CardTitle>Chlorophyll Over Years</CardTitle>
                        <CardDescription>Mean Chlorophyll per year</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <div className="h-64">
                            <Bar data={chlorophyllData} options={chartOptions} />
                        </div>
                        </CardContent>
                    </Card>
                </div>   
            </div>
        </div>     
    </div>
  );
};

export default IndiaMapStations;
