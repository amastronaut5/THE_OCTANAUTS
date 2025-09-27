import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Define the secret token used by the API
const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;
const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

const Visualization = () => {
  // -------------------------------
  // Pie Chart: WaterBody Distribution
  // -------------------------------
  const [waterBodyData, setWaterBodyData] = useState<any>(null);

  useEffect(() => {
    const fetchWaterBodyCounts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/data/waterbody/counts`, {
          headers: {
            'Authorization': `Bearer ${SECRET_TOKEN}`
          }
        });

        if (!res.ok) {
          console.error(`API call failed: ${res.status} ${res.statusText}`);
          const errorText = await res.text();
          throw new Error(`Failed to fetch waterBody counts. Status: ${res.status}. Body: ${errorText}`);
        }

        const json = await res.json();

        setWaterBodyData({
          labels: json.map((item: any) => item.waterBody),
          datasets: [
            {
              label: "Water Body Count",
              data: json.map((item: any) => item.count),
              backgroundColor: [
                "hsl(210, 70%, 50%)",
                "hsl(0, 70%, 55%)",
                "hsl(150, 60%, 50%)",
                "hsl(40, 85%, 55%)",
                "hsl(280, 60%, 60%)",
                "hsl(200, 75%, 55%)"
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching waterBody counts:", err);
      }
    };

    fetchWaterBodyCounts();
  }, []);

  // -------------------------------
  // Bar Chart: Geographic Distribution
  // -------------------------------
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/map-points`, {
          headers: {
            'Authorization': `Bearer ${SECRET_TOKEN}`
          }
        });
        
        if (!res.ok) {
          console.error(`API call failed: ${res.status} ${res.statusText}`);
          const errorText = await res.text();
          throw new Error(`Failed to fetch geo data. Status: ${res.status}. Body: ${errorText}`);
        }

        const json = await res.json();

        // Group longitudes into 6 categories
        const categories = {
          "<60": 0,
          "60-70": 0,
          "70-80": 0,
          "80-90": 0,
          "90-100": 0,
          ">100": 0,
        };

        json.forEach((item: any) => {
          const lon = Number(item.decimalLongitude);
          if (lon < 60) categories["<60"]++;
          else if (lon >= 60 && lon < 70) categories["60-70"]++;
          else if (lon >= 70 && lon < 80) categories["70-80"]++;
          else if (lon >= 80 && lon < 90) categories["80-90"]++;
          else if (lon >= 90 && lon < 100) categories["90-100"]++;
          else categories[">100"]++;
        });

        setGeoData({
          labels: Object.keys(categories),
          datasets: [
            {
              label: "Species Count by Longitude",
              data: Object.values(categories),
              backgroundColor: "hsl(210, 50%, 30%)",
              borderColor: "hsl(195, 100%, 50%)",
              borderWidth: 2,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching geo data:", err);
      }
    };

    fetchGeoData();
  }, []);

  // -------------------------------
  // Timeline Chart: API Data for Year Counts 🚀
  // -------------------------------
  const [timelineAPIData, setTimelineAPIData] = useState<any>(null);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/count-by-year`, {
          headers: {
            'Authorization': `Bearer ${SECRET_TOKEN}`
          }
        });
        
        if (!res.ok) {
          console.error(`API call failed: ${res.status} ${res.statusText}`);
          const errorText = await res.text();
          throw new Error(`Failed to fetch timeline data. Status: ${res.status}. Body: ${errorText}`);
        }

        const json = await res.json();
        
        // Data format: [{ year: 2006, count: 1 }, ...]
        setTimelineAPIData({
          labels: json.map((item: any) => item.year),
          datasets: [
            {
              label: 'Specimens Collected',
              data: json.map((item: any) => item.count),
              borderColor: 'hsl(210, 50%, 30%)',
              backgroundColor: 'hsl(195, 100%, 85%)',
              tension: 0.4,
              fill: true,
            },
          ],
        });
        
      } catch (err) {
        console.error("Error fetching timeline data:", err);
      }
    };

    fetchTimelineData();
  }, []);


  // Use timelineAPIData if available, otherwise it remains null (for the Loading message)
  const timelineData = timelineAPIData || {
    labels: [],
    datasets: [{ label: 'Specimens Collected', data: [] }],
  };


  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" as const } } };
  const pieOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "right" as const } } };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-ocean bg-clip-text text-transparent">
            Data Visualization
          </h1>
          <p className="text-xl text-muted-foreground">
            Interactive charts and insights from marine biodiversity data
          </p>
        </div>

        <div className="grid gap-6">
          {/* Pie Chart: WaterBody */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-background to-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-primary" />
                  Water Body Distribution
                </CardTitle>
                <CardDescription>
                  Entries grouped by water body (from API)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {waterBodyData ? <Pie data={waterBodyData} options={pieOptions} /> : <p className="text-center text-muted-foreground">Loading...</p>}
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart: Longitude */}
            <Card className="bg-gradient-to-br from-background to-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Geographic Distribution
                </CardTitle>
                <CardDescription>
                  Species count by longitude ranges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {geoData ? <Bar data={geoData} options={chartOptions} /> : <p className="text-center text-muted-foreground">Loading...</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline Chart: Now using API data */}
          <Card className="bg-gradient-to-br from-background to-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Collection Timeline
              </CardTitle>
              <CardDescription>
                Specimens collected over time (fetched from API)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {timelineAPIData ? <Line data={timelineData} options={chartOptions} /> : <p className="text-center text-muted-foreground">Loading...</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
