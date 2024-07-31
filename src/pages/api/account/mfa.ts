// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === "POST") {

    } else if (req.method === "GET") {

    }


    res.status(200).json({ name: "John Doe" });
}
