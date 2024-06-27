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

    const dirName = (path as string[]).slice(-1)[0];
    const dirPath = "/" + (path as string[]).slice(0, -1).join("/");

    console.log(dirName);
    console.log(dirPath);
    

    const dir = await db.file.create({
        data: {
            name: dirName ?? "",
            url: "",
            type: 1,
            path: dirPath,
            owner: session.user.id,
            visibility: 0
        }
    });

    return res.status(200).json({ status: 200, message: "Directory created successfully!" });
}