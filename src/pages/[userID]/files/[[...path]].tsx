import { useRouter } from "next/router";
import { font } from "~/utils";

export default function NavigatePath()  {
    const router = useRouter();
    const path = router.isReady ? router.query.path as string[] : [];

    return (
        <div className={`flex flex-col items-center w-screen h-screen ${font}`}>
            <h1 className="text-3xl">Path: { "/" + ( path ? path.join("/") : "" ) }</h1>
        </div>
    )
}