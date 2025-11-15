import express from "express";
import cors from "cors";
import "dotenv/config";

import githubRoutes from "./routes/github.js";
import insightsRoutes from "./routes/insights.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/github", githubRoutes);   // ex: /github/repos, /github/commits
app.use("/insights", insightsRoutes); // ex: /insights?owner=...&repo=...

app.get("/", (req, res) => {
  res.send("🚀 API Dev Insights funcionando!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Backend rodando em http://localhost:${PORT}`)
);
