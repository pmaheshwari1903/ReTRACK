"use server";

import {auth} from '@/lib/auth';
import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {DEFAULT_AUTH_CALLBACK_URL, getSafeCallbackUrlPath, SIGN_IN_PATH} from '@/features/auth/utils';

export async function signInWithGithub(formData: FormData){
    const callbackValue = formData.get('callbackUrl');
    const callback = typeof callbackValue === 'string' ? callbackValue : null;

    const redirectTo = getSafeCallbackUrlPath(callback)

    const result = await auth.api.signInSocial({
        body: {
            provider: "github",
            callbackURL: redirectTo
        },
        headers: await headers()
    })
    
    if(result.url){
        redirect(result.url);
    }
}


// we can use this function to get the Logged-in user's session data from the server

export async function getServerSession(){
    return auth.api.getSession({
        headers: await headers()
    });
}

// redirecting unauthenticated users to the sign-in page.
export async function requireAuth(redirectTo : string = SIGN_IN_PATH) {
    const session = await getServerSession();

    if(!session?.user){
        redirect(redirectTo);
    }

    return session
}


// redirecting authenticated users to the dashboard or a specified page
export async function requireUnAuth(redirectTo : string = DEFAULT_AUTH_CALLBACK_URL) {
    const session = await getServerSession();

    if(session?.user){
        redirect(redirectTo);
    }
}