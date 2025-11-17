
export interface CommitInfo {
  sha: string;
  author: string;
  login: string | null;
  message: string;
  date: string;
  url: string;
}

// tipo dos query params para commits
export interface CommitsQuery {
  owner: string;
  repo: string;
  since?: string;
  until?: string;
}

export interface ReposQuery {
  username?: string;
}