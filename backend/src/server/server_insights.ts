import type { CommitInfo, CommitsQuery } from "../util/type.js";
import { getRepoCommits } from "./github-service..js";
import { generateInsights } from "../gemini.js";

export async function buildInsightsFromRepo(query: CommitsQuery) {
  const { owner, repo, since, until } = query;
  
      if (!owner || !repo) {
        throw new Error("owner e repo são obrigatórios");
      }
  
      // Pega os commits do GitHub
      const commits = await getRepoCommits({owner, repo, since, until});
  
      const messages = commits.map((c: CommitInfo) => c.message).join("\n");
  
      // Gera insights usando Gemini
      const insights = await generateInsights(messages);
  
      return {
        totalCommits: commits.length,
        insights,
        commits,
      };
}
