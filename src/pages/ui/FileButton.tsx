import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon, FileIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { File } from "~/utils";
import download from "downloadjs";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useToast } from "~/components/ui/use-toast";

export default function FileButton({ file } : { file: File })   {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data } = useQuery({
        queryKey: [ 'getURL' ],
        queryFn: async () => {
            const res = await (await fetch(`/api/${file.owner}/file/${file.path}/${file.name}`)).json();
            return res;
        }
    });

    return (
        <div className="w-full grid grid-cols-7 border rounded-md py-4 px-7 cursor-pointer">
            <div className="col-span-1">
                <FileIcon size={24} />
            </div>
            <div className="col-span-3 hover:underline" onClick={_ => download(data.fileURL, data.fileName)}>
                {file.name}
            </div>
            <div className="col-span-3 flex items-center gap-x-5">
                <Dialog>
                    <DialogTrigger>
                        <TrashIcon size={20} className="text-red-600" />
                    </DialogTrigger>
                    <DialogContent>
                        <div className="flex flex-col gap-y-2">
                            <p className="w-full text-center mb-3">Are you sure you want to delete this file?</p>
                            <div className="flex gap-x-2 w-full items-center justify-center">
                                <DialogClose>
                                    <button className="bg-red-600 text-white px-3 py-1 rounded-md w-20 cursor-pointer" onClick={async _ => {
                                        toast({
                                            description: "Deleting file...",
                                        });

                                        const res = await fetch(`/api/${file.owner}/delete/${file.path}/${file.name}`, {
                                            method: "DELETE"
                                        });

                                        if (res.status === 200) {
                                            toast({
                                                description: "File deleted successfully!"
                                            });
                                            queryClient.invalidateQueries();
                                        }
                                        else    {
                                            toast({
                                                variant: "destructive",
                                                description: "Failed to delete file"
                                            });
                                        }
                                    }}>Yes</button>
                                </DialogClose>
                                <DialogClose>
                                    <button className="bg-white text-black border px-3 py-1 rounded-md w-20 cursor-pointer">No</button>
                                </DialogClose>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger>
                        { file.visibility === 1 ? <EyeIcon size={20} /> : <EyeOffIcon size={20} /> }
                    </DialogTrigger>
                    <DialogContent>
                        <div className="flex flex-col gap-y-2">
                            <p className="w-full text-center mb-3">Are you sure you want to change the visibility of this file?</p>
                            <div className="flex gap-x-2 w-full items-center justify-center">
                                <DialogClose>
                                    <button className="bg-red-600 text-white px-3 py-1 rounded-md w-20 cursor-pointer" onClick={async _ => {
                                        toast({
                                            description: "Changing file visibility...",
                                        });

                                        const res = await fetch(`/api/${file.owner}/visibility/${file.path}/${file.name}`, {
                                            method: "POST"
                                        });

                                        if (res.status === 200) {
                                            toast({
                                                description: "File visibility changed successfully!"
                                            });
                                            queryClient.invalidateQueries();
                                        }
                                        else    {
                                            toast({
                                                variant: "destructive",
                                                description: "Failed to change file visibility"
                                            });
                                        }
                                    }}>Yes</button>
                                </DialogClose>
                                <DialogClose>
                                    <button className="bg-white text-black border px-3 py-1 rounded-md w-20 cursor-pointer">No</button>
                                </DialogClose>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}