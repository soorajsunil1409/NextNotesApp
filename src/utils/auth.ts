import GoogleProvider from 'next-auth/providers/google'

export const authOption = {
    providers: [
        GoogleProvider({
            clientId: process.env.CLIENT_ID!,
            clientSecret: process.env.CLIENT_SECRET!,
        }),
    ],
};