import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileIcon } from "lucide-react";
import Link from "next/link";
import { File } from "~/utils";
import download from "downloadjs";

export default function FileButton({ file } : { file: File })   {
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: [ 'getURL' ],
        queryFn: async () => {
            const res = await (await fetch(`/api/${file.owner}/file/${file.path}/${file.name}`)).json();
            return res;
        }
    });

    return (
        <div onClick={_ => download(data.fileURL, data.fileName)} className="w-full grid grid-cols-7 border rounded-md p-2 cursor-pointer">
            <div className="col-span-1">
                <FileIcon size={24} />
            </div>
            <div className="col-span-3">
                {file.name}
            </div>
            <div className="col-span-3">
                {file.path}
            </div>
        </div>
    )
}