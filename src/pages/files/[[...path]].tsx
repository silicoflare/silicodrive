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
    
    const path = router.isReady ? ["/", ...(Array.isArray(router.query.path) ? router.query.path : [])] : [];

    // useEffect(() => {
    //     const creator = async () => {
    //         if (session)    {
    //             if (path.length === 1)  {
    //                 const res = await (await fetch(`/api/${session.user.id}/create`)).json();
    //             }
    //         }
    //     };
        
    //     creator();
    // }, [ session, path ]);

    return (
        <>
            <Head>
                <title>Files in { path.length !== 1 ? path.join("/") : "/" } - SilicoDrive</title>
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
                <FormDialog path={path.length !== 1 ? path.join("/") : "/"} />
                <FileViewer path={path.length !== 1 ? path.join("/") : "/"} />
            </div>
        </>
    )
}

NavigatePath.auth = true;