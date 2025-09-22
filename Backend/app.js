// app.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 1102; // you can change this

// Middleware to parse JSON
app.use(express.json());
app.use(cors);

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, Backend is running 🚀");
});

// Example API route
app.post("/api/data", (req, res) => {
  const { name } = req.body;
  res.json({ message: `Hello, ${name}! Your data is received.` });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
