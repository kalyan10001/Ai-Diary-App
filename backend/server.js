// backend/server.js

import { configDotenv } from "dotenv";
import express from "express";
import ConnectToDb from "./db/ConnectToDb.js";
import Diaryrouter from "./routes/DiaryRoutes.js";

const app = express();
configDotenv();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/diary",Diaryrouter)

app.listen(PORT, () => {
  console.log(`Server is running on Port :${PORT}`);
  ConnectToDb();
});
