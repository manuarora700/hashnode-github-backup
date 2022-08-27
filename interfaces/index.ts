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

export interface GitFile {
  path?: string | undefined;
  mode?: "100644" | "100755" | "040000" | "160000" | "120000" | undefined;
  type?: "blob" | "tree" | "commit" | undefined;
  sha?: string | null | undefined;
  content?: string | undefined;
}

export interface LocalFile {
  contents: string;
  mode?: "100644" | "100755" | "040000" | "160000" | "120000" | undefined;
  type?: "blob" | "tree" | "commit" | undefined;
  fileName: string;
}
