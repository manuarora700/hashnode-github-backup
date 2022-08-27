// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import { getContentsOfRepo } from "@/lib/index";
import { GithubContents, LocalFile } from "@/interfaces/index";

import { GitUtils } from "@/lib/gitUtils";

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
