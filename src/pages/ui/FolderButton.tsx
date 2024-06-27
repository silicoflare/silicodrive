import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileIcon, Folder, TrashIcon } from "lucide-react";
import Link from "next/link";
import { File } from "~/utils";
import download from "downloadjs";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/router";

export default function FolderButton({ file } : { file: File })   {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return (
        <div className="w-full grid grid-cols-7 border rounded-md py-4 px-7 cursor-pointer">
            <div className="col-span-1">
                <Folder size={24} />
            </div>
            <a className="col-span-3 hover:underline" href={`${router.asPath}${router.asPath.endsWith('/') ? '' : '/'}${file.name}`}>
                {file.name}
            </a>
            <div className="col-span-3 flex items-center gap-x-3">
                <Dialog>
                    <DialogTrigger>
                        <TrashIcon size={20} className="text-red-600" />
                    </DialogTrigger>
                    <DialogContent>
                        <div className="flex flex-col gap-y-2">
                            <p className="w-full text-center mb-3">Are you sure you want to delete this folder?</p>
                            <div className="flex gap-x-2 w-full items-center justify-center">
                                <DialogClose>
                                    <button className="bg-red-600 text-white px-3 py-1 rounded-md w-20 cursor-pointer" onClick={async _ => {
                                        toast({
                                            description: "Deleting folder...",
                                        });

                                        const res = await fetch(`/api/${file.owner}/deletedir/${file.path}/${file.name}`, {
                                            method: "DELETE"
                                        });

                                        if (res.status === 200) {
                                            toast({
                                                description: "Folder deleted successfully!"
                                            });
                                            queryClient.invalidateQueries();
                                        }
                                        else if (res.status === 400) {
                                            toast({
                                                variant: "destructive",
                                                description: "Folder is not empty"
                                            });
                                        }
                                        else    {
                                            toast({
                                                variant: "destructive",
                                                description: "Failed to delete folder"
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