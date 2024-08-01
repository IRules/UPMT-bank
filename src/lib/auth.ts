import LogtoClient, {LogtoContext} from '@logto/next';
import useSWR, {SWRResponse} from "swr";
import {createContext} from "react";

export const logtoClient = new LogtoClient({
    endpoint: 'https://auth.upm8.dev/',
    appId: 'lc2mvq507ravxedt0fhwn',
    appSecret: 'z7Sy1mDye5G1HezHgDUaCZotK2botpUe',
    baseUrl: 'http://localhost:3000',
    cookieSecret: '1tCuQFvz1aHWDDfFhHUL7Pk8tdqsmqbP',
    cookieSecure: process.env.NODE_ENV === 'production',
});

async function fetcher(url: string) {
    const res = await fetch(url);
    return await res.json();
}

const AuthContext = createContext<SWRResponse<LogtoContext, any, any>>(null as unknown as SWRResponse<LogtoContext, any, any>)

export default logtoClient;
export { fetcher, AuthContext };