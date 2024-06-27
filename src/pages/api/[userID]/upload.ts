import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt"
import * as formidable from 'formidable';
import fs from 'fs';

import { db } from "~/server/db";
import { supabase } from "~/utils";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = async (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });

  const { userID } = req.query;
  const user = JSON.parse(JSON.stringify(token, null, 2))

  if (!token) {
    return res.status(401).json({ status: 401, error: "Not Authorized" });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 405, error: "Method not allowed" });
  }

  if (user.id !== userID) {
    return res.status(401).json({ status: 401, error: "Not Authorized" });
  }

  try {
    const { fields, files } = await parseForm(req);
    //@ts-ignore
    const path = fields.path[0] as string;
    //@ts-ignore
    const file = files.file[0] as formidable.File;

    if (!file) {
      return res.status(400).json({ status: 400, error: "No file uploaded" });
    }


    const uploadPath = `${user.id}${path}/${file.originalFilename}`.replace(/\/\//g, "/")
    const fileContent = await fs.promises.readFile(file.filepath);


    const up = await supabase.storage
      .from('silicodrive')
      .upload(uploadPath, fileContent);

    if (up.error) {
        return res.status(500).json({ status: 500, message: "Internal error" });
    }

    const status = await db.file.create({
      data: {
        name: file.originalFilename || 'unnamed',
        owner: user.id,
        path,
        type: 0,
        url: up.data.path,
        visibility: 0
      }
    });

    return res.status(200).json({ status: 200, message: `File uploaded successfully to path` });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
}