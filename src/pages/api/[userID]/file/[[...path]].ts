import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "~/server/db";
import { supabase } from "~/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse)    {
    const session = await getSession({ req });
    const { userID, path } = req.query;

    const fileData = await db.file.findFirst({
        where: {
            owner: userID as string ?? "",
            path: path ? "/" + (path.slice(0, -1) as string[]).join("/") : "/",
            name: path ? path[path.length - 1] : ""
        }
    });

    if (!fileData)  {
        return res.status(404).json({ status: 404, error: "File not found" });
    }

    if (fileData.visibility === 0) {
        if (!session)   {
            return res.status(401).json({ status: 401, error: "Unauthorized" });
        }

        else if (session.user.id !== userID) {
            return res.status(401).json({ status: 401, error: "Unauthorized" });
        }
    }

    const file = await supabase.storage.from("silicodrive").getPublicUrl(fileData.url);

    return res.status(200).json({ status: 200, fileName: fileData.name, fileURL: file.data.publicUrl });
}