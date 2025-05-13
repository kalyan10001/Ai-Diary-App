// backend/server.js

import { configDotenv } from "dotenv";
import express from "express";

const app = express();
configDotenv();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
