import NextAuth from "next-auth"
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions = {
    providers: [

    ],
}

export default NextAuth(authOptions)