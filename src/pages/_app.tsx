import { type Session } from 'next-auth';
import { SessionProvider, useSession, signIn } from 'next-auth/react';
import { type AppType } from 'next/app';
import { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "~/styles/globals.css";
import { Toaster } from '~/components/ui/toaster';

const queryClient = new QueryClient();

const App: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                {(Component as any).auth ? (
                    <Auth>
                        <Component {...pageProps} />
                    </Auth>
                ) : (
                    <Component {...pageProps} />
                )}
                <Toaster />
            </QueryClientProvider>
        </SessionProvider>
    )
}

function Auth({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession()
    const isUser = !!session?.user

    useEffect(() => {
        if (status === "loading") return
        if (!isUser) signIn()
    }, [isUser, status])

    if (isUser) {
        return children
    }

    return <div>Loading...</div>
}

export default App;