import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogContent } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useToast } from "~/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function FormDialog({ path } : { path: string })    {
    const { data: session } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!session)   {
            router.push("/")
        }
    }, []);

    const formSchema = z.object({
        file: z.instanceof(File)
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    async function onSubmit(values: z.infer<typeof formSchema>)   {
        if (session)    {
            const formData = new FormData();
            formData.append('file', values.file);
            formData.append("path", path);
    
            const res = await fetch(`/api/${session.user.id}/upload`, {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            if (res.status === 200) {
                toast({
                    description: "File uploaded successfully",
                });
                queryClient.invalidateQueries();
            }
            else    {
                toast({
                    description: "Failed to upload file",
                    variant: "destructive"
                })
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger className="w-full flex items-center justify-end px-20">
                <Button className="flex items-center gap-x-2 bg-black"><Upload className="w-5 h-5" /> Upload</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>File</FormLabel>
                                    <FormControl>
                                        <Input type="file" onChange={(e) => field.onChange(e.target.files![0])} />
                                    </FormControl>
                                </FormItem>
                            )}
                        /><br />
                        <DialogClose className="w-full flex items-center justify-center">
                            <Button type="submit">Submit</Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

FormDialog.auth = true;