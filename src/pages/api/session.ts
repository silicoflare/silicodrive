import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse)    {
    const session = await getSession({ req });

    if (!session)   {
        return res.status(401).json({ status: 401, error: "Not authorized" });
    }
    return res.status(200).json({ status: 200, message: `Logged in as ${session.user.name}` });
}
