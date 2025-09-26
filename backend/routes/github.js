import { Router } from "express";
import axios from "axios";

const router = Router();

// Lista repositórios
router.get("/repos", async (req, res) => {
  try {
    const { username } = req.query;
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lista commits
router.get("/commits", async (req, res) => {
  try {
    const { owner, repo, since, until } = req.query;

    let url = `https://api.github.com/repos/${owner}/${repo}/commits`;
    const params = [];
    if (since) params.push(`since=${since}`);
    if (until) params.push(`until=${until}`);
    if (params.length) url += "?" + params.join("&");

    const response = await axios.get(url, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
    });

    // 🔹 Formata os commits
    const commits = response.data.map(c => ({
      sha: c.sha,
      author: c.commit.author.name,
      login: c.author ? c.author.login : null,
      message: c.commit.message,
      date: c.commit.author.date,
      url: c.html_url
    }));

    res.json(commits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
