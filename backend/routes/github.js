import { Router } from "express";
import axios from "axios";

const router = Router();

// Função para listar commits (named export)
export const getRepoCommits = async ({ owner, repo, since, until }) => {
  let url = `https://api.github.com/repos/${owner}/${repo}/commits`;
  const params = [];
  if (since) params.push(`since=${since}`);
  if (until) params.push(`until=${until}`);
  if (params.length) url += "?" + params.join("&");

  const response = await axios.get(url, {
    headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
  });

  return response.data.map(c => ({
    sha: c.sha,
    author: c.commit.author.name,
    login: c.author ? c.author.login : null,
    message: c.commit.message,
    date: c.commit.author.date,
    url: c.html_url
  }));
};

// Lista repositórios
router.get("/repos", async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: "Informe o username" });
    }
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    const status = err.response?.status || 500;
    res.status(status).json({
         error:"Erro ao acessar API do Github",
         details: err.response?.data || err.message
        });
  }
});

// Lista commits via rota
router.get("/commits", async (req, res) => {
  try {
    const commits = await getRepoCommits(req.query);
    res.json(commits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
