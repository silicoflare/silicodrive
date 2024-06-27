import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { font } from "~/utils";
import download from "downloadjs";
import { Download } from "lucide-react";

export default function NavigatePath()  {
    const router = useRouter();
    const path = router.isReady ? ["/", ...(Array.isArray(router.query.path) ? router.query.path : [])] : [];
    const { data: session } = useSession();

    const [ file, setFile ] = useState<string[]|null>(null);

    useEffect(() => {
        const fetchFile = async () => {
            const file = await fetch(`/api/${router.query.userID}/file${"/" + path.slice(1).join("/")}`);

            if (file.status === 200)   {
                const data = await file.json();
                console.log([ data.fileName, data.fileURL ]);
                setFile([ data.fileName, data.fileURL ]);
            }
            else    {  
                setFile(null);
            }
        }

        if (router.isReady) {
            fetchFile();
        }
    }, [ router.isReady ]);


    return (
        <div className={`flex flex-col items-center justify-center w-screen h-screen ${font} `}>
            {
                file === null ? (
                    <div className="p-5 border rounded-md border-red-600 bg-red-600 flex flex-col items-center justify-center text-white w-1/3 h-1/3">
                        Unauthorized
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center border rounded-md p-5 w-1/3">
                        <h1 className="text-3xl font-semibold">SilicoDrive</h1>
                        <button className="p-2 px-5 rounded-md border bg-black text-white mt-10 flex items-center gap-x-2" onClick={_ => download(file[1], file[0])}><Download /> Download</button>
                    </div>
                )
            }
        </div>
    )
}