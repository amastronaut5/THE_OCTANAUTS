import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = 3000;
const supabaseUrl = "https://fwxoxvhsrmrncjvcwoqz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3eG94dmhzcm1ybmNqdmN3b3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3ODAzODMsImV4cCI6MjA3NDM1NjM4M30.dI5zygTjLuehW2f5wiuk9rADJ3PY5Vws-6goeU6W3Mk";

// ===== Supabase connection =====
const supabase = createClient(
  supabaseUrl,  // 🔑 replace with your project URL
  supabaseKey                 // 🔑 use service_role key (NOT anon key for server)
);

// ===== Authentication Middleware =====
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const tokenFromQuery = req.query.token;

  // Prefer header, fallback to query param
  const token = authHeader?.split(" ")[1] || tokenFromQuery;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  if (token !== "my-secret-token") {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }

  next();
};

// ===== Routes =====

// GET all data
app.get("/data", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("metadata")
      .select(
        `id,
         scientificName,
         identifiedBy,
         dateIdentified,
         waterBody,
         samplingProtocol,
         habitat,
         eventTime,
         eventDate,
         occurrenceStatus,
         lifeStage,
         individualCount`
      );

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET data by ID
app.get("/data/id/:id", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("metadata")
      .select("*")
      .eq("id", req.params.id);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET data by scientificName (partial match)
app.get("/data/scientificName/:name", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("metadata")
      .select("*")
      .ilike("scientificName", `%${req.params.name}%`); // 🔑 case-insensitive partial match

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
