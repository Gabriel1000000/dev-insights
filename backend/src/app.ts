import express from "express";
import cors from "cors";

import githubRoutes from "./routes/github.js";
import insightsRoutes from "./routes/insights.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/github", githubRoutes);
app.use("/insights", insightsRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API Dev Insights funcionando!");
});

export default app;

