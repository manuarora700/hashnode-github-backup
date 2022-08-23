// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: any, res: any) {
  try {
    let accessToken = "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";
    let API = `https://api.github.com/users/manuarora700/repos?sort=updated`;

    let response: any = await axios.get(API, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "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",
      },
      params: {
        orderBy: "CREATED_AT",
      },
    });

    res.status(200).json({ repos: response?.data });
  } catch (err: any) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Something went wrong, Please refresh and try again" });
  }
}
