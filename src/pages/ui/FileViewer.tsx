import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { File } from "~/utils";
import FileButton from "./FileButton";
import FolderButton from "./FolderButton";
import { useEffect } from "react";

export default function FileViewer({ path } : { path: string }) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const router = useRouter();

    useEffect(() => {
        queryClient.invalidateQueries();
    }, []);

    const { data: files } = useQuery({
        queryKey: [ 'getFiles' ],
        queryFn: async () => {
            if (session)    {
                const res = await (await fetch(`/api/${session.user.id}/list${path}`)).json();
                const files = res.files as File[];
                return files.sort((a, b) => {
                    if (a.type !== b.type) {
                        return b.type - a.type;
                    }
                    return a.name.localeCompare(b.name);
                });
            }
            return [] as File[];
        },
        refetchOnMount: true
    });

    return (
        <div className="w-3/4 px-10 mt-5 flex flex-col items-center gap-y-2">
            {
                files && files.length > 0 ? files.map(file => (
                    file.type === 0 ? <FileButton file={file} /> : <FolderButton file={file} />
                )) : (
                    <div className="w-full text-center text-gray-400 text-3xl">
                        No files here...
                    </div>
                )
            }
        </div>
    )
}