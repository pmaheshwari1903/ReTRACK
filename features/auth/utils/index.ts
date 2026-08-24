export const SIGN_IN_PATH = "/sign-in";
export const DEFAULT_AUTH_CALLBACK_URL = "/dashboard";

// Sanitize the callback URL to ensure it is a valid relative path within the application

export function getSafeCallbackUrlPath(callbackUrl: string | null | undefined): string {
    if (callbackUrl?.startsWith("/") && !callbackUrl?.startsWith("//")) {
        return callbackUrl;
    }
    return DEFAULT_AUTH_CALLBACK_URL;
}