import 'dotenv/config'; 
import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";

const app = express();
app.use(cors({
    origin: 'http://localhost:8080' 
}));
const port = 4000;

// ----------------- SUPABASE CONNECTION -----------------
const supabaseUrl = "https://fwxoxvhsrmrncjvcwoqz.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3eG94dmhzcm1ybmNqdmN3b3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3ODAzODMsImV4cCI6MjA3NDM1NjM4M30.dI5zygTjLuehW2f5wiuk9rADJ3PY5Vws-6goeU6W3Mk";
const supabase = createClient(supabaseUrl, supabaseKey);

// ----------------- AUTH MIDDLEWARE -----------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (token !== "mysecrettoken") return res.sendStatus(403);

  next();
}
function toTitleCase(s = "") {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// ----------------- ROUTES -----------------

// ✅ 1. Get raw data (with eventDate as text → extract day/month/year)
app.get("/data", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from("oceanography").select("*").limit(100);
    if (error) throw error;

    const formattedData = data.map((row) => {
      let day = null, month = null, year = null;
      if (row.eventDate) {
        const date = new Date(row.eventDate);
        if (!isNaN(date)) {
          day = date.getDate();
          month = date.getMonth() + 1;
          year = date.getFullYear();
        }
      }
      return { ...row, day, month, year };
    });

    res.json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 2. Count by species
app.get("/api/count-by-species", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from("oceanography").select("scientificName").limit(1000);
    if (error) throw error;

    const counts = {};
    data.forEach((row) => {
      counts[row.scientificName] = (counts[row.scientificName] || 0) + 1;
    });

    const result = Object.entries(counts)
      .map(([scientificName, count]) => ({ scientificName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 3. Count by year
app.get("/api/count-by-year", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from("oceanography").select("eventDate").limit(1000);
    if (error) throw error;

    const counts = {};
    data.forEach((row) => {
      if (row.eventDate) {
        const date = new Date(row.eventDate);
        if (!isNaN(date)) {
          const year = date.getFullYear();
          counts[year] = (counts[year] || 0) + 1;
        }
      }
    });

    const result = Object.entries(counts)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 4. Habitat distribution
app.get("/api/habitat-distribution", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from("oceanography").select("habitat").limit(1000);
    if (error) throw error;

    const counts = {};
    data.forEach((row) => {
      counts[row.habitat] = (counts[row.habitat] || 0) + 1;
    });

    const result = Object.entries(counts)
      .map(([habitat, count]) => ({ habitat, count }))
      .sort((a, b) => b.count - a.count);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 5. Map points
app.get("/api/map-points", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("metadata")
      .select("decimalLatitude, decimalLongitude, scientificName")
      .limit(1000);

    if (error) throw error;

    const filtered = data.filter(
      (row) => row.decimalLatitude && row.decimalLongitude
    );

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 6. Life stage breakdown
app.get("/api/life-stage", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from("oceanography").select("lifeStage").limit(1000);
    if (error) throw error;

    const counts = {};
    data.forEach((row) => {
      counts[row.lifeStage] = (counts[row.lifeStage] || 0) + 1;
    });

    const result = Object.entries(counts)
      .map(([lifeStage, count]) => ({ lifeStage, count }))
      .sort((a, b) => b.count - a.count);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 7. Get record by ID
app.get("/api/record/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from("oceanography").select("*").eq("id", id);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 8. Get record by scientific name
app.get("/api/record/scientific/:name", authenticateToken, async (req, res) => {
  const { name } = req.params;
  try {
    const { data, error } = await supabase
      .from("oceanography")
      .select("*")
      .ilike("scientificName", `%${name}%`)
      .limit(50);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 9. Count by waterBody (fixed integration)
app.get("/data/waterbody/counts", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from("oceanography").select("waterBody");
    if (error) throw error;

    const counts = {};
    data.forEach((row) => {
      const raw = row?.waterBody;
      if (!raw) return;
      const key = raw.trim().toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });

    const result = Object.entries(counts)
      .map(([waterBody, count]) => ({ waterBody: toTitleCase(waterBody), count }))
      .sort((a, b) => b.count - a.count);

    res.json(result);
  } catch (err) {
    console.error("Error fetching waterBody counts:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ----------------- SERVER -----------------
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
