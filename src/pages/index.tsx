import { signIn, signOut, useSession } from "next-auth/react"
import Head from "next/head"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { font } from "~/utils";

export default function Home()  {
    const { data: session } = useSession();
    const router = useRouter();
    return (
        <>
            <Head>
                <title>SilicoDrive</title>
            </Head>
            <div className={`flex flex-col w-screen h-screen items-center justify-center ${font}`}>
                <h1 className="text-4xl font-bold">SilicoDrive</h1>
                <div className="w-1/3 text-center">All your files in one place, safe and secure.</div>
                <br />
                { !session && (
                    <button className="px-10 py-2 border border-black bg-black text-white hover:bg-white hover:text-black transition duration-200 ease-in-out rounded-md" onClick={_ => signIn("google", { callbackUrl: `/files` })}>Log in</button>
                )}
                { session && (
                    <button className="px-10 py-2 border border-black hover:bg-black hover:text-white transition duration-200 ease-in-out rounded-md" onClick={_ => router.push("/files")}>Go to Dashboard</button>
                )}
            </div>
        </>

    )
}