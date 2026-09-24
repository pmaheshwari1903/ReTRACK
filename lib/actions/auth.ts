/**
 * @module lib/actions/auth
 * @description Server Actions for authentication flows.
 */

"use server";

import { auth } from "@/lib/auth";
import { getSafeCallbackPath } from "@/lib/auth-routes";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInWithGithub(formData: FormData) {
    const callbackUrl = formData.get("callbackUrl");
    const redirectTo = getSafeCallbackPath(
        typeof callbackUrl === "string" ? callbackUrl : null
    );

    const res = await auth.api.signInSocial({
        body: {
            provider: "github",
            callbackURL: redirectTo,
        },
        headers: await headers(),
        asResponse: true,
    });

    const cookieStore = await cookies();
    const setCookieHeaders = res.headers.getSetCookie();

    for (const cookieStr of setCookieHeaders) {
        const parts = cookieStr.split(";").map((p) => p.trim());
        const [name, ...valParts] = parts[0].split("=");
        const value = valParts.join("=");

        if (name && value !== undefined) {
            cookieStore.set(name, value, {
                path: "/",
                httpOnly: cookieStr.toLowerCase().includes("httponly"),
                sameSite: cookieStr.toLowerCase().includes("samesite=lax")
                    ? "lax"
                    : cookieStr.toLowerCase().includes("samesite=strict")
                    ? "strict"
                    : "lax",
                secure: cookieStr.toLowerCase().includes("secure"),
            });
        }
    }

    const data = await res.json();
    if (data.url) {
        redirect(data.url);
    }
}