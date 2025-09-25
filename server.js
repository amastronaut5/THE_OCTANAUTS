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

// Helper: Capitalize first letter, rest lowercase
function CapitalizeString(str) {
  var firstLetter = str[0].toUpperCase();
  var restString = "";
  for (let i = 1; i < str.length; i++) {
    restString += str[i].toLowerCase();
  }
  return firstLetter + restString;
}

// ✅ Get all rows
app.get("/data", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("taxonomy_data")
      .select("*");

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error:", err.message);
    res.sendStatus(500);
  }
});

// ✅ Get by category (case-insensitive)
app.get("/api/:category", async (req, res) => {
  const category = req.params.category;
  const finalString = CapitalizeString(category);
  const upperCaseString = category.toUpperCase();

  try {
    const { data, error } = await supabase
      .from("taxonomy_data")
      .select("*")
      .in("Category", [finalString, upperCaseString]);  // matches multiple values

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error retrieving category:", err.message);
    res.sendStatus(500);
  }
});

// ✅ Get by taxonomic group
app.get("/:group", async (req, res) => {
  const group = req.params.group;
  const finalString = CapitalizeString(group);

  try {
    const { data, error } = await supabase
      .from("taxonomy_data")
      .select("*")
      .eq("Taxonomic Group", finalString);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error retrieving group:", err.message);
    res.sendStatus(500);
  }
});

// ✅ Get totals
app.get("/get/total", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("taxonomy_data")
      .select("*")
      .in("Category", [
        "TOTAL  (ANIMALIA)",
        "TOTAL  (ANIMALIA)  (PROTISTA I + ANIMALIA II)"
      ]);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error retrieving totals:", err.message);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
