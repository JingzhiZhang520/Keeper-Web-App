import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";

const { Client } = pg; // Extract Client from pg

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173" // Allow requests from your frontend URL
  }));

// PostgreSQL Connection
const db = new pg.Client({
  user: "postgres",  // Replace with your PostgreSQL username
  host: "localhost",      // Replace with your host, if not localhost
  database: "keeperdb",   // Database name
  password: "123456",  // Replace with your PostgreSQL password
  port: 5433,             // Default PostgreSQL port
});
db.connect((err) => {
    if (err) {
      console.error("Database connection error:", err.stack);
    } else {
      console.log("Connected to PostgreSQL database");
    }
  });

// Routes
// Fetch all notes
app.get("/notes", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM notes");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add a new note
app.post("/notes", async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a note
app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM notes WHERE id = $1", [id]);
    res.status(200).json({ message: "Note deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  
