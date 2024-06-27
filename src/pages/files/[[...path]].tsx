import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { font } from "~/utils";
import Head from "next/head";
import BreadPath from "../ui/BreadPath";
import { Upload } from 'lucide-react';
import FormDialog from "../ui/FormDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FileViewer from "../ui/FileViewer";


export default function NavigatePath()  {
    const router = useRouter();
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    
    const path = router.isReady ? ["/", ...(Array.isArray(router.query.path) ? router.query.path : [])] : [];

    useEffect(() => {
        queryClient.invalidateQueries();
        console.log(path);
    }, []);

    return (
        <>
            <Head>
                <title>Files in { "/" + path.slice(1).join("/") } - SilicoDrive</title>
            </Head>
            <div className={`flex flex-col items-center w-screen h-screen ${font}`}>
                <div className="w-full py-5 px-7 flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-semibold">SilicoDrive</h1>
                    <div className="flex flex-row items-center gap-x-3">
                        <div className="flex flex-col items-end leading-tight">
                            <span className="">Logged in as</span>
                            <span className="font-semibold">{session?.user.name}</span>
                        </div>
                        <button onClick={_ => signOut()} className="border border-red-600 rounded-md px-5 py-1 text-white bg-red-600 hover:bg-red-400 hover:border-red-400 transition duration-200 ease-in-out">Logout</button>
                    </div>
                </div>
                <BreadPath path={path} />
                <FormDialog path={"/" + path.slice(1).join("/")} />
                <FileViewer path={"/" + path.slice(1).join("/")} />
            </div>
        </>
    )
}

NavigatePath.auth = true;