import axios from "axios";
import { config } from "../config/config.js";
import { Request, Response, Router } from "express";
import { StatusCode } from "../util/status-code.js";
import { getRepoCommits } from "../server/github-service..js";
import type { CommitsQuery, ReposQuery} from "../util/type.js";

const router = Router();

// Lista repositórios
router.get("/repos", async (req: Request<{}, {}, {}, ReposQuery>, res: Response) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(StatusCode.BAD_REQUEST).json({ error: "Informe o username" });
    }

    const response = await axios.get(`https://api.github.com/users/${username}/repos`,
    {
      headers: {
        Authorization: `token ${config.githubToken || ""}`,
      },
    });

    return res.json(response.data);
  } catch (err) {
    const error = err as any;
    console.error(error.response?.data || error.message);
    const status = error.response?.status || StatusCode.INTERNAL_SERVER_ERROR;

    return res.status(status).json({
      error: "Erro ao acessar API do Github",
      details: error.response?.data || error.message,
    });
  }
});

// Lista commits via rota
router.get("/commits", async (req: Request<{}, {}, {}, CommitsQuery>, res: Response) => {
  try {
    const { owner, repo, since, until } = req.query;

    if (!owner || !repo) {
      return res.status(StatusCode.BAD_REQUEST).json({ error: "Informe owner e repo" });
    }

    const commits = await getRepoCommits({ owner, repo, since, until });
    return res.json(commits);
  } catch (err) {
    const erro = err as any;
    console.error("Erro ao listar commits:", erro.message || erro);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Erro ao listar commits" });
  }
});

export default router;
