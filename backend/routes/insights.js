// src/routes/insights.js
import { Router } from "express";
import { getRepoCommits } from "./github.js"; // Corrigido para apontar para o arquivo certo
import { generateInsights } from "../gemini.js";

const router = Router();

// Rota principal de insights
router.get("/", async (req, res) => {
  try {
    const { owner, repo, since, until } = req.query;

    if (!owner || !repo) {
      return res.status(400).json({ error: "Informe owner e repo" });
    }

    // Pega os commits do GitHub
    const commits = await getRepoCommits({ owner, repo, since, until });
    const messages = commits.map(c => c.message).join("\n");

    // Gera insights usando OpenAI
    const insights = await generateInsights(messages);

    // Retorna JSON com commits e insights
    res.json({
      totalCommits: commits.length,
      insights,
      commits
    });
  } catch (err) {
    console.error("Erro ao gerar insights:", err);
    res.status(500).json({ error: "Erro ao gerar insights" });
  }
});

export default router;
