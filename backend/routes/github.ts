import { Request, Response, Router } from "express";
import axios from "axios";
import type { CommitInfo, CommitsQuery, ReposQuery} from "../util/type.js";
import { StatusCode } from "../util/status-code.js";

const router = Router();

// Função para listar commits (named export)
export const getRepoCommits = async ({owner, repo, since, until}: CommitsQuery): Promise<CommitInfo[]> => {
  let url = `https://api.github.com/repos/${owner}/${repo}/commits`;
  const params: string[] = [];

  if (since) params.push(`since=${since}`);
  if (until) params.push(`until=${until}`);
  if (params.length) url += "?" + params.join("&");

  const response = await axios.get(url, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN || ""}`,
    },
  });

  return response.data.map((c: any): CommitInfo => ({
    sha: c.sha,
    author: c.commit.author.name,
    login: c.author ? c.author.login : null,
    message: c.commit.message,
    date: c.commit.author.date,
    url: c.html_url,
  }));
};

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
          Authorization: `token ${process.env.GITHUB_TOKEN || ""}`,
        },
      }
    );

    return res.json(response.data);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    const status = err.response?.status || StatusCode.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      error: "Erro ao acessar API do Github",
      details: err.response?.data || err.message,
    });
  }
}
);

// Lista commits via rota
router.get("/commits", async (req: Request<{}, {}, {}, CommitsQuery>, res: Response) => {
  try {
    const { owner, repo, since, until } = req.query;

    if (!owner || !repo) {
      return res.status(StatusCode.BAD_REQUEST).json({ error: "Informe owner e repo" });
    }

    const commits = await getRepoCommits({ owner, repo, since, until });
    return res.json(commits);
  } catch (err: any) {
    console.error("Erro ao listar commits:", err.message || err);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Erro ao listar commits" });
  }
}
);

export default router;
