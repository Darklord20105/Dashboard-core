import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"; // 1. Import the client plugin

const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: typeof window !== "undefined"
    ? window.location.origin // In the browser, use the current active Vercel Preview URL
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ,
  plugins: [
    adminClient()
  ],
  sessionOptions: {
    refetchOnWindowFocus: true,
    refetchWhenOffline: false,
    refetchInterval: 0,
  },
})

const { signIn, signUp, signOut, useSession } = authClient;

export {
  authClient,
  signIn,
  signUp,
  signOut,
  useSession
}
