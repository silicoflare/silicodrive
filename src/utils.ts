import { Space_Grotesk } from "next/font/google";
import { createClient } from '@supabase/supabase-js';
import { env } from "./env";

// fonts
const space = Space_Grotesk({ subsets: [ 'latin' ] });


// supabase
export const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


export const font = space.className;


export type File = {
    fileID: string;
    name: string;
    url: string;
    type: number;
    path: string;
    owner: string;
    visibility: number;
};
