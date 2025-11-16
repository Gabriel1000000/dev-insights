// src/routes/insights.ts
import { Request, Response, Router } from "express";
import { getRepoCommits } from "./github.js";
import { generateInsights } from "../gemini.js";
import { StatusCode } from "../util/status-code.js";
import type { CommitsQuery, CommitInfo } from "../util/type.js";

const router = Router();

router.get("/", async (req: Request<{}, {}, {}, CommitsQuery>, res: Response) => {
  try {
    const { owner, repo, since, until } = req.query;

    if (!owner || !repo) {
      return res.status(StatusCode.BAD_REQUEST).json({ error: "Informe owner e repo" });
    }

    // Pega os commits do GitHub
    const commits = await getRepoCommits({owner, repo, since, until});

    const messages = commits.map((c: CommitInfo) => c.message).join("\n");

    // Gera insights usando Gemini
    const insights = await generateInsights(messages);

    res.json({
      totalCommits: commits.length,
      insights,
      commits,
    });
  } catch (err: any) {
    console.error("Erro ao gerar insights:", err);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Erro ao gerar insights" });
  }
});

export default router;
