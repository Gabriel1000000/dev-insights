import axios from "axios";
import { config } from "../config/config.js";
import { CommitInfo, CommitsQuery } from "../util/type.js";

// Função para listar commits (named export)
export const getRepoCommits = async ({owner, repo, since, until}: CommitsQuery): Promise<CommitInfo[]> => {
  let url = `https://api.github.com/repos/${owner}/${repo}/commits`;
  const params: string[] = [];

  if (since) params.push(`since=${since}`);
  if (until) params.push(`until=${until}`);
  if (params.length) url += "?" + params.join("&");

  const response = await axios.get(url, {
    headers: {
      Authorization: `token ${config.githubToken || ""}`,
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