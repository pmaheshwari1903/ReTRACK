import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: "https://yelling-scrooge-preaching.ngrok-free.dev/",
});
const signIn = async () => {
    const data = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
    })
}