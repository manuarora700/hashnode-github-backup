// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import moment from "moment";
import {
  getContentsOfRepo,
  getRepo,
  GithubContents,
  updateRepoWithMarkdown,
} from "../../lib";
import sha1 from "sha1";
import { Blob } from "buffer";
import { Octokit, App } from "octokit";
import { performance } from "perf_hooks";

interface GitFile {
  path?: string | undefined;
  mode?: "100644" | "100755" | "040000" | "160000" | "120000" | undefined;
  type?: "blob" | "tree" | "commit" | undefined;
  sha?: string | null | undefined;
  content?: string | undefined;
}

interface LocalFile {
  contents: string;
  mode?: "100644" | "100755" | "040000" | "160000" | "120000" | undefined;
  type?: "blob" | "tree" | "commit" | undefined;
  fileName: string;
}

class Meassure {
  private startTime: number;
  private endTime: number;
  constructor() {
    this.startTime = 0;
    this.endTime = 0;
  }
  public start() {
    this.startTime = performance.now();
  }

  public stop() {
    this.endTime = performance.now();
  }

  public calculate(message = "") {
    console.log(`${message} ${this.endTime - this.startTime} milliseconds`);

    this.startTime = 0;
    this.endTime = 0;
  }
}

class GitUtils {
  private owner: string;
  private repo: string;

  octokit: Octokit;
  constructor(key: string, owner: string, repo: string) {
    this.owner = owner;
    this.repo = repo;
    this.octokit = new Octokit({ auth: key });
  }

  public pushToOrigin = async (
    files: LocalFile[],
    message = "update",
    branchName = "main"
  ) => {
    const measure = new Meassure();

    measure.start();
    const gitFiles: GitFile[] = await this.createBlobs(files);
    measure.stop();

    measure.calculate("Upload blobs:: ");

    measure.start();
    const defaultBranchHeadSha: string | undefined = await this.loadRef(
      branchName
    );
    measure.stop();

    measure.calculate("Get branch ref:: ");

    if (defaultBranchHeadSha) {
      measure.start();
      const tree = await this.createTree(gitFiles, defaultBranchHeadSha);
      measure.stop();
      measure.calculate("Tree created:: ");

      measure.start();
      const commit = await this.createCommit(
        message,
        tree,
        defaultBranchHeadSha as string
      );
      measure.stop();
      measure.calculate("commit:: ");

      measure.start();
      await this.octokit.rest.git["updateRef"]({
        owner: this.owner,
        repo: this.repo,
        force: true,
        ref: `heads/${branchName}`,
        sha: commit.sha,
      });
      measure.stop();
      measure.calculate("Head ref updated:: ");
    }
  };

  private createBlob = async (content: string) => {
    const {
      data: { sha },
    } = await this.octokit.rest.git.createBlob({
      owner: this.owner,
      repo: this.repo,
      content,
      encoding: "base64",
    });

    return sha;
  };

  private createBlobs = async (files: LocalFile[]): Promise<GitFile[]> => {
    const treeItems: GitFile[] = [];
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < files.length; i++) {
        try {
          const properties = files[i];

          const contents = properties.contents;
          const mode = properties.mode || "100644";
          const type = properties.type || "blob";
          const fileName = properties.fileName;

          if (!contents) {
            return reject(`No file contents provided for ${fileName}`);
          }

          const fileSha = await this.createBlob(contents);

          treeItems.push({
            path: fileName,
            sha: fileSha,
            mode,
            type,
          });
        } catch (e) {
          console.log(`Ignored error creating blobs: ${e}`);
          continue;
          return reject(e);
        }
      }

      resolve(treeItems);
    });
  };

  private createTree = async (
    treeItems: GitFile[],
    branchHeadSha: string | undefined
  ) => {
    return (
      await this.octokit.rest.git.createTree({
        owner: this.owner,
        repo: this.repo,
        tree: treeItems,
        base_tree: branchHeadSha,
      })
    ).data;
  };

  private createCommit = async (
    message: string,
    tree: any,
    baseTree: string
  ) => {
    return (
      await this.octokit.rest.git.createCommit({
        owner: this.owner,
        repo: this.repo,
        message,
        tree: tree.sha,
        parents: [baseTree],
      })
    ).data;
  };

  private loadRef = async (ref: string) => {
    try {
      const x = await this.octokit.rest.git.getRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${ref}`,
      });

      return x.data.object.sha;
    } catch (e) {
      // console.log(e);
    }
  };

  public static getFileSha = (contents: string) => {
    return sha1(`blob ${Buffer.byteLength(contents)}\0${contents}`);
  };
}

export default async function handler(req: any, res: any) {
  let { markdowns } = req.body;

  const owner = "manuarora700";
  const repo = "posts-backup";

  const githubUtil = new GitUtils(
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN as string,
    owner,
    repo
  );

  try {
    const githubContents: GithubContents[] | null = await getContentsOfRepo(
      owner,
      repo
    );

    const filesContentMap: { [fileName: string]: string } = {};

    githubContents?.forEach((file: GithubContents) => {
      filesContentMap[file.name] = file.sha;
    });

    const diffFiles: LocalFile[] = [];

    for (let i = 0; i < markdowns.length; i++) {
      const blogSha = GitUtils.getFileSha(markdowns[i]?.contentMarkdown);
      let fileName = `${markdowns[i]?._id}.md`;

      // console.log(blogSha, "         ", filesContentMap[fileName]);

      if (fileName in filesContentMap) {
        if (blogSha === filesContentMap[fileName]) {
          continue;
        } else {
          diffFiles.push({
            contents: Buffer.from(markdowns[i]?.contentMarkdown).toString(
              "base64"
            ),
            fileName,
          });
        }
      } else {
        diffFiles.push({
          contents: Buffer.from(markdowns[i]?.contentMarkdown).toString(
            "base64"
          ),
          fileName,
        });
      }
    }

    // console.log('diffFiles', diffFiles);

    if (diffFiles.length > 0) {
      await githubUtil.pushToOrigin(
        diffFiles,
        `Backup Successful - ${moment().format("Do MMM YYYY")}`
      );

      res.status(200).json({
        error: false,
        message: "done",
        data: {
          link: "/",
        },
      });
    } else {
      res.status(200).json({
        error: false,
        message: "done",
        data: "already updated",
      });
    }
  } catch (err: any) {
    console.log("error catch block", err?.message);
    res
      .status(500)
      .json({ error: "Something went wrong, Please refresh and try again" });
  }
}
