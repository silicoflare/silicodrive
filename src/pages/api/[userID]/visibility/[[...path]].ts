import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "~/server/db";
import { supabase } from "~/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse)    {
    const session = await getSession({ req });
    const { userID, path } = req.query;

    if (!session)   {
        return res.status(401).json({ status: 401, error: "Unauthorized" });
    }

    else if (session.user.id !== userID) {
        return res.status(401).json({ status: 401, error: "Unauthorized" });
    }

    const newPath = path ? "/" + (path as string[]).filter(x => x !== "delete").join("/") : "/";
    console.log(newPath);

    const fileData = await db.file.findFirst({
        where: {
            owner: session.user.id,
            path: path ? "/" + (path.slice(0, -1) as string[]).join("/") : "/",
            name: path ? path[path.length - 1] : ""
        }
    });

    if (!fileData)  {
        return res.status(404).json({ status: 404, error: "File not found" });
    }

    const file = await db.file.update({
        where: {
            fileID: fileData.fileID
        },
        data: {
            visibility: fileData.visibility === 0 ? 1 : 0
        }
    })

    return res.status(200).json({ status: 200, fileName: fileData.name, message: "File visibility changed" });
}