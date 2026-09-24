'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { signInWithGithub } from '@/features/auth/actions';
import { useFormStatus } from 'react-dom';
import { GithubLogoIcon } from '@phosphor-icons/react';

export function SubmitButton() {
    const { pending } = useFormStatus();
    let buttonLabel = 'Continue with GitHub';
    let buttonIcon = <GithubLogoIcon className="size-4" />;

    if (pending) {
        buttonLabel = 'Redirecting to GitHub...';
        buttonIcon = <Spinner className="size-4" />;
    }

    return (
        <Button type="submit" size={"lg"} disabled={pending} className={"w-full"}>
            {buttonIcon}
            {buttonLabel}
        </Button>
    );
}

type GithubSignInFormProps = {
    callbackUrl?: string;
}

export function GithubSignInForm({ callbackUrl }: GithubSignInFormProps) {
    return (
        <form action={signInWithGithub} className="w-full">
            {callbackUrl ? (
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
            ) : null}
            <SubmitButton />
        </form>
    )
}