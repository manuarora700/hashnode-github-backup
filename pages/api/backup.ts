// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import moment from "moment";
import { getRepo, updateRepoWithMarkdown } from "../../lib";

export default async function handler(req: any, res: any) {
  try {
    // REFERENCE: https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
    let API = "https://api.github.com/repos/manuarora700/posts-backup/contents";

    let { markdowns } = req.body;

    let promises = [];
    for (let i = 0; i < markdowns.length; i++) {
      // Check if repo exists - If Yes, SHA will exist.
      let fileName = `${markdowns[i]?._id}.md`;
      let getRepoData = await getRepo(fileName);

      let data: any = {
        message: `Create Post: ${markdowns[i]?.title} - ${moment().format(
          "Do MMM YYYY hh:mm a"
        )}`,
        content: Buffer.from(markdowns[i]?.contentMarkdown).toString("base64"),
      };

      if (getRepoData?.sha) {
        data.message = `Update Post: ${markdowns[i]?.title} - ${moment().format(
          "Do MMM YYYY hh:mm a"
        )}`;
        data.sha = getRepoData?.sha;
      }

      var config = {
        method: "put",
        url: `${API}/${markdowns[i]?._id}.md`,
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      };

      promises.push(
        axios(config)
          .then(function (response) {
            return response?.data;
          })
          .catch(function (error) {
            console.log("err", error?.message);
            return null;
          })
      );
    }

    await Promise.all(promises)
      .then((response: any) => {
        console.log("Promise.all() successful!");
        res.status(200).json({
          error: false,
          message: "Articles Backed Up Successfully!",
          data: {
            link: "https://github.com/manuarora700/posts-backup",
          },
        });
      })
      .catch((err) => {
        console.log("Promise.all() failed!", err?.message);
        res.status(500).json({
          error: "Something went wrong, please try again",
          message: "Articles Backed Up Successfully!",
        });
      });
  } catch (err: any) {
    console.log("error catch block", err?.message);
    res
      .status(500)
      .json({ error: "Something went wrong, Please refresh and try again" });
  }
}
