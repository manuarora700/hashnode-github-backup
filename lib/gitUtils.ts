import { Measure } from "@/util/Measure";
import { Octokit } from "octokit";
import { GitFile, LocalFile } from "../interfaces";
import sha1 from "sha1";

export class GitUtils {
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
    // Note: Measure is used to measure performace - Only for logging purpose.
    const measure = new Measure();

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
