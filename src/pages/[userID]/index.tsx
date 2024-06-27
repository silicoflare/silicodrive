import { useRouter } from "next/router";
import { font } from "~/utils";

export default function UserProfile()   {
    const router = useRouter();

    return (
        <div className={`flex flex-col items-center justify-center w-screen h-screen ${font}`}>
            { router.query.userID }
        </div>
    )
}