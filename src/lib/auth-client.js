import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"; // 1. Import the client plugin

const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    plugins: [
        adminClient() 
    ]
})

const { signIn, signUp, signOut, useSession } = authClient;

export {
   authClient,
   signIn, 
   signUp, 
   signOut, 
   useSession 
}