import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "~/server/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse)    {
    const session = await getSession({ req });
    const { userID } = req.query;

    if (!session)   {
        return res.status(401).json({ status: 401, error: "Not authorized" });
    }


    const userRoot = await db.file.findFirst({
        where: {
            owner: userID as string,
            path: "/"
        }
    });

    if (!userRoot)  {
        await db.file.create({
            data: {
                name: "root",
                url: "",
                type: 1,
                path: "/",
                owner: session.user.id,
                visibility: 0
            }
        });
        return res.status(200).json({ status: 200, message: "Root created!" });
    }
    else    {
        return res.status(200).json({ status: 200, message: "Root exists!" });
    }
}