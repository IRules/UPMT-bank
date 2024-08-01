import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {useRouter} from "next/router";
import useSWR from "swr";
import {fetcher, AuthContext} from "@/lib/auth";
import {useEffect} from "react";

export default function App({Component, pageProps}: AppProps) {
    const {data, error, isLoading, mutate, isValidating} = useSWR('/api/logto/user', fetcher);

    const {push} = useRouter();

    useEffect(
        () => {
            if (!data?.isAuthenticated) {
                fetch("/api/account/verified").then(
                    (response) => {
                       console.log(response.body)
                    }
                )
            }
        }
    )

    if (isLoading) return <div className="w-screen h-screen bg-black"></div>
    if (error) return <div
        className="w-screen h-screen bg-black text-white flex justify-center items-center text-6xl font-bold">Authentication
        Error!</div>

    if (!data?.isAuthenticated) {
        push('/api/logto/sign-in').then(r => {
        });
        return <div className="w-screen h-screen bg-black"></div>
    }

    return (
        <AuthContext.Provider value={{data, error, isLoading, mutate, isValidating}}>
            <Component {...pageProps} />
        </AuthContext.Provider>
    );
}
