import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { File } from "~/utils";
import FileButton from "./FileButton";

export default function FileViewer({ path } : { path: string }) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data: files } = useQuery({
        queryKey: [ 'getFiles' ],
        queryFn: async () => {
            if (session)    {
                const res = await (await fetch(`/api/${session.user.id}/list${path}`)).json();
                const files = res.files as File[];
                return files;
            }
            return [] as File[];
        }
    });

    return (
        <div className="w-3/4 px-10 mt-5 flex flex-col items-center gap-y-2">
            {
                files && files.map(file => (
                    file.type === 0 ? <FileButton file={file} /> : null
                ))
            }
        </div>
    )
}