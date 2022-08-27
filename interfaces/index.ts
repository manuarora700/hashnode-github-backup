export interface GithubContents {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export interface Markdown {
  _id?: string;
  contentMarkdown?: string;
  title?: string;
}

export interface Meta {
  title?: string;
  description?: string;
  children?: any;
}
