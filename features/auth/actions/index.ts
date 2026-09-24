"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  DEFAULT_AUTH_CALLBACK_URL,
  getSafeCallbackUrlPath,
  SIGN_IN_PATH,
} from "@/features/auth/utils";

export async function signInWithGithub(formData: FormData) {
  const callbackValue = formData.get("callbackUrl");

  const callback =
    typeof callbackValue === "string" ? callbackValue : null;

  const redirectTo = getSafeCallbackUrlPath(callback);

  const res = await auth.api.signInSocial({
    body: {
      provider: "github",
      callbackURL: redirectTo,
    },
    headers: await headers(),
    asResponse: true,
  });

  const data = await res.json();

  if (data.url) {
    redirect(data.url);
  }
}

// Get the logged-in user's session data from the server.
export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

// Redirect unauthenticated users to the sign-in page.
export async function requireAuth(
  redirectTo: string = SIGN_IN_PATH
) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect(redirectTo);
  }

  return session;
}

// Redirect authenticated users to the dashboard or a specified page.
export async function requireUnAuth(
  redirectTo: string = DEFAULT_AUTH_CALLBACK_URL
) {
  const session = await getServerSession();

  if (session?.user) {
    redirect(redirectTo);
  }
}
