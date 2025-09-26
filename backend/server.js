import express from "express";
import cors from "cors";
import 'dotenv/config';

import githubRoutes from "./routes/github.js";
import insightsRoutes from "./routes/insights.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/", githubRoutes);
app.use("/", insightsRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API Dev Insights funcionando!");
});

app.listen(4000, () => console.log("✅ Backend rodando em http://localhost:4000"));
