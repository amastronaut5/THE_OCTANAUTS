import express from "express";
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';
import cors from "cors";

const app = express();
const port = 4000;
app.use(cors());
// ----------------- SUPABASE CONNECTION -----------------
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
console.log("Supabase URL:", process.env.SUPABASE_URL);
console.log("Supabase Key:", process.env.SUPABASE_KEY ? "OK" : "MISSING");

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

// ✅ 1. Get raw data (with eventDate as text)
app.get("/data", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from("oceanography").select("*").limit(100);
    if (error) throw error;

    // Extract day, month, year from eventDateText
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
    const { data, error } = await supabase
      .from("oceanography")
      .select("scientificName")
      .limit(1000);

    if (error) throw error;

    // Count manually
    const counts = {};
    data.forEach((row) => {
      counts[row.scientificName] = (counts[row.scientificName] || 0) + 1;
    });

    // Convert to sorted array
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

// ✅ 7. Get record by ID or scientific name
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

// GET counts of species by waterBody
app.get("/data/waterbody/counts", authenticateToken, async (req, res) => {
  try {
    // fetch only the waterBody column (filtering could be added if needed)
    const { data, error } = await supabase.from("oceanography").select("waterBody");

    if (error) throw error;

    // count occurrences (case-insensitive grouping, trim whitespace)
    const map = new Map();
    for (const row of data || []) {
      const raw = row?.waterBody;
      if (!raw) continue;
      const trimmed = String(raw).trim();
      if (trimmed === "") continue;
      const key = trimmed.toLowerCase(); // normalize for grouping
      map.set(key, (map.get(key) || 0) + 1);
    }

    // convert to array and sort descending by count
    const result = Array.from(map.entries())
      .map(([key, count]) => ({ waterBody: toTitleCase(key), count }))
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
