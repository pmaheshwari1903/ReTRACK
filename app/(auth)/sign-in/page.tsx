import Image from 'next/image'
import type { Metadata } from 'next'
import { GithubSignInForm } from '@/features/auth/components/github-sign-in-form'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldSet,
} from '../../../components/ui/field'

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in ReTrack Code Reviewer with your Github account.",
}

type SignInPageProps = {
    searchParams: Promise<{ callbackUrl?: string }>;
}

const SignInPage = async ({searchParams} : SignInPageProps) => {
    const { callbackUrl } = await searchParams;

  return (
        <main className="flex min-h-screen items-center justify-center bg-[#111111] px-5 py-10 text-[#f3f3f1]">
            <Card className="w-full max-w-[500px] gap-4 rounded-2xl border border-white/[0.08] bg-[#151515] px-0 py-0 text-[#f3f3f1] shadow-[0_0_35px_rgba(0,0,0,0.20)]">
                <CardHeader className="items-center justify-items-center px-10 pt-8 text-center sm:px-12">
                    <Image
                        src="/retrack-logo.png"
                        alt="ReTrack logo"
                        width={88}
                        height={88}
                        className="mb-6 size-[88px] rounded-2xl object-cover"
                        priority
                    />

                    <CardTitle className="text-3xl font-semibold normal-case tracking-tight text-white">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="mt-3 text-base leading-6 text-white/45">
                        Sign in with GitHub to review and manage your code.
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-10 pb-8 sm:px-12">
                    <FieldSet>
                        <FieldGroup className="gap-0">
                            <Field>
                                <GithubSignInForm callbackUrl={callbackUrl} />
                                <FieldDescription className="mt-5 text-center text-xs leading-6 text-white/40">
                                    We only request the permissions needed to identify your account. <br/> You can revoke access anytime from GitHub settings.
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </CardContent>
            </Card>
        </main>
  )
}

export default SignInPage
