import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "~/server/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse)    {
    const session = await getSession({ req });
    const { userID, path } = req.query;

    if (!session)   {
        return res.status(401).json({ status: 401, error: "Unauthorized" });
    }

    else if (session.user.id !== userID) {
        return res.status(401).json({ status: 401, error: "Unauthorized" });
    }

    const files = await db.file.findMany({
        where: {
            owner: session.user.id,
            path: path ? "/" + (path as string[]).join("/") : "/"
        }
    });

    return res.status(200).json({ status: 200, files: files });
}