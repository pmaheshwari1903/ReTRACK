"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserMenuWithSession } from "@/features/auth/components/user-menu";
import { authClient } from "@/lib/auth-client";
import { signInWithGithub } from "@/features/auth/actions";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  GithubLogoIcon,
  GitPullRequestIcon,
  SparkleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CpuIcon,
  ArrowRightIcon,
  CodeIcon,
  LightningIcon,
  TerminalWindowIcon,
  SquaresFourIcon,
  CheckIcon,
  BrainIcon,
} from "@phosphor-icons/react";

function GithubSubmitButton({
  variant = "default",
  size = "lg",
  className = "",
  label = "Continue with GitHub",
}: {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={pending}
      className={cn("gap-2.5 font-medium cursor-pointer transition-all duration-200", className)}
    >
      {pending ? (
        <Spinner className="size-4 animate-spin text-current" />
      ) : (
        <GithubLogoIcon className="size-5 shrink-0" />
      )}
      <span>{pending ? "Connecting to GitHub..." : label}</span>
    </Button>
  );
}

function GithubAuthButton({
  callbackUrl = "/dashboard",
  label = "Continue with GitHub",
  variant = "default",
  size = "lg",
  className = "",
}: {
  callbackUrl?: string;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}) {
  return (
    <form action={signInWithGithub} className="inline-block">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <GithubSubmitButton
        variant={variant}
        size={size}
        className={className}
        label={label}
      />
    </form>
  );
}

export default function Home() {
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<"diff" | "summary" | "context">("diff");
  const [copiedInstall, setCopiedInstall] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("npx retrack-cli@latest init");
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] dark:bg-[#0a0a0c] text-stone-900 dark:text-stone-100 font-sans selection:bg-rose-500/20 selection:text-rose-800 dark:selection:text-rose-200 relative overflow-x-hidden transition-colors duration-200">
      
      {/* Structural Minimal Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e5e1d8_1px,transparent_1px),linear-gradient(to_bottom,#e5e1d8_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1b1a1f_1px,transparent_1px),linear-gradient(to_bottom,#1b1a1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 z-0" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#f8f6f0]/90 dark:bg-[#0a0a0c]/90 border-b border-stone-300/80 dark:border-stone-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative size-8 rounded-md overflow-hidden border border-stone-300 dark:border-stone-700 bg-stone-900 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/retrack-logo.png"
                alt="ReTrack logo"
                width={32}
                height={32}
                className="object-cover"
                priority
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                ReTrack
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500 border-l border-stone-300 dark:border-stone-800 pl-2">
                リトラック
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400">
            <a href="#features" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
              Workflow
            </a>
            <a href="#pricing" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
              Pricing
            </a>
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            {session?.user ? (
              <div className="flex items-center gap-3">
                <Button asChild variant="outline" size="sm" className="rounded-md border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs">
                  <Link href="/dashboard">
                    Dashboard <ArrowRightIcon className="size-3.5 ml-1" />
                  </Link>
                </Button>
                <UserMenuWithSession variant="compact" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <GithubAuthButton
                  label="Sign In"
                  variant="ghost"
                  size="sm"
                  className="text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded-md px-3 text-xs"
                />
                <GithubAuthButton
                  label="Sign Up with GitHub"
                  variant="default"
                  size="sm"
                  className="rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs px-4 border border-rose-700 shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6 max-w-7xl mx-auto text-center">
        
        {/* Japanese Hanko / Red Stamp Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-mono mb-8 shadow-sm">
          <span className="size-2 rounded-full bg-rose-600 animate-ping inline-block"></span>
          <span>コードレビュー · AI Code Reviewer</span>
          <span className="text-rose-400/50">|</span>
          <span className="text-stone-600 dark:text-stone-400">Pinecone RAG</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-stone-900 dark:text-white max-w-4xl mx-auto leading-[1.15] mb-6">
          Automate Code Reviews with <br className="hidden sm:inline" />
          <span className="text-rose-600 dark:text-rose-500">
            Full Repository Context
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          ReTrack embeds your GitHub codebase into Pinecone vector storage to detect architectural defects, security leaks, and bugs with 100% repo awareness.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {session?.user ? (
            <Button asChild size="lg" className="rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium px-8 py-6 text-base shadow-sm transition-transform hover:scale-105">
              <Link href="/dashboard">
                Go to Dashboard <ArrowRightIcon className="size-5 ml-2" />
              </Link>
            </Button>
          ) : (
            <GithubAuthButton
              label="Sign Up with GitHub"
              size="lg"
              className="rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium px-8 py-6 text-base shadow-sm transition-transform hover:scale-105"
            />
          )}

          <a href="#how-it-works">
            <Button variant="outline" size="lg" className="rounded-md border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 px-7 py-6 text-base">
              <GitPullRequestIcon className="size-5 mr-2 text-stone-600 dark:text-stone-400" />
              See Workflow
            </Button>
          </a>
        </div>

        {/* Quick Install Banner */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-md bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 font-mono text-xs text-stone-600 dark:text-stone-400 mb-16 shadow-sm">
          <TerminalWindowIcon className="size-4 text-rose-600 dark:text-rose-400" />
          <span>Quick Setup:</span>
          <code className="text-stone-900 dark:text-stone-200">npx retrack-cli@latest init</code>
          <button
            onClick={handleCopyInstall}
            className="ml-2 px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors text-[11px]"
            title="Copy command"
          >
            {copiedInstall ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Hero Code Review Interactive Simulator */}
        <div className="max-w-5xl mx-auto rounded-xl border border-stone-300 dark:border-stone-800 bg-[#0e0e11] p-2 sm:p-3 shadow-xl text-left relative group">
          {/* Top Bar Decorator */}
          <div className="flex flex-wrap items-center justify-between border-b border-stone-800 bg-[#141418] px-4 py-3 rounded-t-lg gap-2">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span className="size-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span className="size-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span className="ml-2 font-mono text-xs text-stone-400 flex items-center gap-1.5">
                <GitPullRequestIcon className="size-4 text-rose-400" />
                retrack-org / code-reviewer · <span className="text-stone-200">PR #42</span>
              </span>
            </div>

            {/* Simulator Tabs */}
            <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-md border border-stone-800 text-xs font-mono">
              <button
                onClick={() => setActiveTab("diff")}
                className={cn(
                  "px-3 py-1 rounded transition-colors",
                  activeTab === "diff"
                    ? "bg-rose-600/20 text-rose-300 border border-rose-500/40 font-medium"
                    : "text-stone-400 hover:text-stone-200"
                )}
              >
                Code Diff & Fix
              </button>
              <button
                onClick={() => setActiveTab("summary")}
                className={cn(
                  "px-3 py-1 rounded transition-colors",
                  activeTab === "summary"
                    ? "bg-rose-600/20 text-rose-300 border border-rose-500/40 font-medium"
                    : "text-stone-400 hover:text-stone-200"
                )}
              >
                AI Summary
              </button>
              <button
                onClick={() => setActiveTab("context")}
                className={cn(
                  "px-3 py-1 rounded transition-colors",
                  activeTab === "context"
                    ? "bg-rose-600/20 text-rose-300 border border-rose-500/40 font-medium"
                    : "text-stone-400 hover:text-stone-200"
                )}
              >
                Pinecone Vectors
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm bg-[#09090b] rounded-b-lg overflow-x-auto min-h-[320px] text-stone-200">
            {activeTab === "diff" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-800">
                  <span>File: <code className="text-stone-300">features/auth/actions/index.ts</code></span>
                  <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">
                    +12 lines | -4 lines
                  </span>
                </div>

                {/* Diff Lines */}
                <div className="space-y-1 font-mono text-xs sm:text-sm leading-relaxed">
                  <div className="text-stone-600 select-none">@@ -14,6 +14,14 @@ export async function signInWithGithub(formData: FormData) &#123;</div>
                  <div className="text-stone-400 pl-4">  const callbackValue = formData.get("callbackUrl");</div>
                  <div className="bg-red-950/50 text-red-300 border-l-2 border-red-500 pl-4 py-1 flex items-center justify-between">
                    <span>- const redirectTo = callbackValue || "/dashboard"; // Unsanitized URL redirect</span>
                    <span className="text-[10px] text-red-400 bg-red-900/40 px-1.5 py-0.5 rounded">Security Risk</span>
                  </div>
                  <div className="bg-emerald-950/50 text-emerald-300 border-l-2 border-emerald-500 pl-4 py-1">
                    <span>+ const redirectTo = getSafeCallbackUrlPath(callbackValue); // Open-redirect protected</span>
                  </div>
                  <div className="text-stone-400 pl-4">  const res = await auth.api.signInSocial(&#123;</div>
                  <div className="text-stone-400 pl-4">    body: &#123; provider: "github", callbackURL: redirectTo &#125;,</div>
                </div>

                {/* ReTrack AI Bot Comment Card */}
                <div className="mt-4 rounded-md border border-rose-500/40 bg-rose-950/20 p-4 relative shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-rose-600 flex items-center justify-center text-white text-xs">
                        印
                      </div>
                      <span className="font-semibold text-xs text-rose-200">ReTrack AI Reviewer</span>
                      <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 text-[10px]">
                        99.2% Vector Context Match
                      </Badge>
                    </div>
                    <span className="text-[11px] text-stone-500">Just now</span>
                  </div>

                  <p className="text-xs text-stone-300 mb-3 leading-normal">
                    ⚠️ <strong>Security Advisory:</strong> Prevents potential open redirect vulnerabilities by using <code className="bg-rose-950/60 text-rose-200 px-1 rounded border border-rose-900">getSafeCallbackUrlPath()</code> from <code className="text-stone-300">features/auth/utils</code>. Verified against your codebase standards.
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-rose-500/20 text-xs">
                    <Button size="sm" className="h-7 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs gap-1">
                      <CheckIcon className="size-3" /> Auto-approve PR
                    </Button>
                    <span className="text-stone-500 text-[11px]">Indexed via Pinecone vector namespace <code className="text-stone-400 font-mono">repo_retrack_v1</code></span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-stone-900 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-wider flex items-center gap-2">
                      <BrainIcon className="size-4 text-rose-400" /> Executive Code Review Analysis
                    </h4>
                    <span className="text-xs text-emerald-400 font-mono">Status: PASS (With 1 Suggestion)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-stone-300">
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Architecture:</strong> Correctly adheres to Next.js 16 Server Actions patterns.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Performance:</strong> Zero extra DB queries added; utilizes cached Better-Auth session.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheckIcon className="size-4 text-rose-400 shrink-0 mt-0.5" />
                      <span><strong>Security Audit:</strong> Fixed open redirect parameter sanitization. No secrets exposed.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "context" && (
              <div className="space-y-3 font-mono text-xs">
                <div className="text-stone-400">Pinecone Vector Index Queries executed for PR #42:</div>
                <div className="p-3 rounded bg-stone-950 border border-stone-800 space-y-2 text-stone-300">
                  <div className="flex items-center justify-between text-stone-400">
                    <span>1. Query: &quot;auth redirect safety utility&quot;</span>
                    <span className="text-rose-400">Score: 0.984</span>
                  </div>
                  <div className="text-emerald-400 text-[11px] pl-4">→ Match: features/auth/utils/index.ts (Line 6-11)</div>

                  <div className="flex items-center justify-between text-stone-400 pt-2 border-t border-stone-900">
                    <span>2. Query: &quot;BetterAuth social signin provider callback&quot;</span>
                    <span className="text-rose-400">Score: 0.951</span>
                  </div>
                  <div className="text-emerald-400 text-[11px] pl-4">→ Match: lib/auth.ts & lib/auth-client.ts</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="border-y border-stone-300/80 dark:border-stone-800/80 bg-stone-100/80 dark:bg-stone-900/40 py-12 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mb-1 font-mono">&lt; 30s</div>
            <div className="text-xs text-stone-600 dark:text-stone-400 font-mono uppercase">Review Speed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 dark:text-rose-400 mb-1 font-mono">100%</div>
            <div className="text-xs text-stone-600 dark:text-stone-400 font-mono uppercase">Pinecone Vector Context</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mb-1 font-mono">0 Config</div>
            <div className="text-xs text-stone-600 dark:text-stone-400 font-mono uppercase">Instant Webhooks</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 dark:text-rose-400 mb-1 font-mono">1-Click</div>
            <div className="text-xs text-stone-600 dark:text-stone-400 font-mono uppercase">GitHub Integration</div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 text-xs px-3 py-1 mb-4 font-mono">
            機能 · Powerful AI Engine
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-white mb-4">
            Context-Aware Code Intelligence
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-lg">
            Standard AI review tools evaluate diffs in isolation. ReTrack queries Pinecone vector indices to understand your full repository architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="rounded-xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-8 hover:border-rose-500/50 transition-all group shadow-sm">
            <div className="size-10 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 group-hover:scale-105 transition-transform">
              <CpuIcon className="size-5" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-2">Pinecone Vector Storage</h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              Every codebase module and import is vector-indexed in Pinecone. ReTrack references real existing utility functions before making suggestions.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-8 hover:border-rose-500/50 transition-all group shadow-sm">
            <div className="size-10 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 group-hover:scale-105 transition-transform">
              <LightningIcon className="size-5" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-2">Automated PR Webhooks</h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              Inngest background workers trigger the second a GitHub PR is opened or updated, leaving clean inline comments on your code lines.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-8 hover:border-rose-500/50 transition-all group shadow-sm">
            <div className="size-10 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 group-hover:scale-105 transition-transform">
              <ShieldCheckIcon className="size-5" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-2">Security & Leak Audits</h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              Spots unhandled promise rejections, open redirects, memory leaks, and exposed secret keys automatically before merge.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-8 hover:border-rose-500/50 transition-all group shadow-sm">
            <div className="size-10 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 group-hover:scale-105 transition-transform">
              <GithubLogoIcon className="size-5" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-2">Single-Click GitHub OAuth</h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              No complicated password management. Authenticate with your GitHub account, select your repositories, and start reviewing code.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-8 hover:border-rose-500/50 transition-all group shadow-sm">
            <div className="size-10 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 group-hover:scale-105 transition-transform">
              <CodeIcon className="size-5" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-2">Custom Team Rules</h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              Enforce repository guidelines, naming conventions, and specific architectural boundaries tailored to your team.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-8 hover:border-rose-500/50 transition-all group shadow-sm">
            <div className="size-10 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 group-hover:scale-105 transition-transform">
              <SquaresFourIcon className="size-5" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-2">Developer Dashboard</h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              Track PR review history, connected GitHub installations, review usage, and billing settings from one unified portal.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-stone-100/80 dark:bg-stone-950/60 border-y border-stone-300/80 dark:border-stone-800/80 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 text-xs px-3 py-1 mb-4 font-mono">
              手順 · 4-Step Workflow
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-white mb-4">
              Seamless Integration
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-lg">
              Get automated AI code reviews running on your GitHub pull requests in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-stone-900/50 shadow-sm">
              <div className="font-mono text-2xl font-bold text-rose-600 dark:text-rose-400 mb-4">一 / 01</div>
              <h3 className="text-base font-semibold text-stone-900 dark:text-white mb-2">Sign In with GitHub</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                Single-click GitHub OAuth login. No passwords required.
              </p>
              <GithubAuthButton label="Sign In Now" size="sm" variant="outline" className="w-full text-xs rounded border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-white" />
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-stone-900/50 shadow-sm">
              <div className="font-mono text-2xl font-bold text-rose-600 dark:text-rose-400 mb-4">二 / 02</div>
              <h3 className="text-base font-semibold text-stone-900 dark:text-white mb-2">Connect Repositories</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Select repositories from your GitHub account for ReTrack to monitor.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-stone-900/50 shadow-sm">
              <div className="font-mono text-2xl font-bold text-rose-600 dark:text-rose-400 mb-4">三 / 03</div>
              <h3 className="text-base font-semibold text-stone-900 dark:text-white mb-2">Pinecone Vector Sync</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                ReTrack embeds your codebase structure into vector storage automatically.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-stone-900/50 shadow-sm">
              <div className="font-mono text-2xl font-bold text-rose-600 dark:text-rose-400 mb-4">四 / 04</div>
              <h3 className="text-base font-semibold text-stone-900 dark:text-white mb-2">PR Review Comments</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Open a Pull Request on GitHub to receive instant, line-by-line AI comments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 text-xs px-3 py-1 mb-4 font-mono">
            料金 · Simple Pricing
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-white mb-4">
            Start Reviewing for Free
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-lg">
            Choose a plan tailored to your development workload.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-stone-900/40 p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white">Starter</h3>
                <Badge variant="secondary" className="bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700">Free Forever</Badge>
              </div>
              <div className="font-mono text-4xl font-extrabold text-stone-900 dark:text-white mb-6">₹0 <span className="text-xs text-stone-500 dark:text-stone-400 font-sans font-normal">/ month</span></div>

              <ul className="space-y-3 text-sm text-stone-700 dark:text-stone-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-rose-600 dark:text-rose-400 shrink-0" /> Up to 3 GitHub Repositories
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-rose-600 dark:text-rose-400 shrink-0" /> Unlimited Automated PR Reviews
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-rose-600 dark:text-rose-400 shrink-0" /> Standard Pinecone Vector Indexing
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-rose-600 dark:text-rose-400 shrink-0" /> Single GitHub Sign-In Access
                </li>
              </ul>
            </div>

            <GithubAuthButton
              label="Sign Up with GitHub (Free)"
              className="w-full rounded-md bg-stone-900 text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200 font-medium py-3"
            />
          </div>

          {/* Pro Tier */}
          <div className="rounded-2xl border border-rose-500/50 bg-rose-50/30 dark:bg-rose-950/20 p-8 flex flex-col justify-between relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 bg-rose-600 text-white font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-bl-md">
              Recommended
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white">Pro Developer</h3>
                <Badge className="bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30">Popular</Badge>
              </div>
              <div className="font-mono text-4xl font-extrabold text-stone-900 dark:text-white mb-6">₹999 <span className="text-xs text-stone-500 dark:text-stone-400 font-sans font-normal">/ month</span></div>

              <ul className="space-y-3 text-sm text-stone-700 dark:text-stone-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-rose-600 dark:text-rose-400 shrink-0" /> Unlimited GitHub Repositories
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-rose-600 dark:text-rose-400 shrink-0" /> Priority Pinecone Vector Indexing
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-rose-600 dark:text-rose-400 shrink-0" /> Custom Team Rules & Guidelines
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-rose-600 dark:text-rose-400 shrink-0" /> In-depth Security & OWASP Audits
                </li>
              </ul>
            </div>

            <GithubAuthButton
              label="Get Started with Pro"
              className="w-full rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center relative z-10">
        <div className="rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-10 sm:p-16 relative overflow-hidden shadow-lg">
          <h2 className="text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white mb-6 max-w-3xl mx-auto">
            Ready to Upgrade Your Code Reviews?
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-lg max-w-xl mx-auto mb-8">
            Connect your GitHub account in one click and experience context-aware AI reviews.
          </p>

          <GithubAuthButton
            label="Sign Up with GitHub Now"
            size="lg"
            className="rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium px-9 py-6 text-lg shadow-sm transition-transform hover:scale-105"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-300/80 dark:border-stone-800/80 bg-stone-100 dark:bg-[#070709] py-12 px-6 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/retrack-logo.png"
              alt="ReTrack logo"
              width={28}
              height={28}
              className="rounded object-cover"
            />
            <span className="font-semibold text-stone-900 dark:text-white text-sm">ReTrack · リトラック</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-500 font-mono">
            <span>Powered by Pinecone & Better Auth</span>
            <span>·</span>
            <GithubAuthButton
              label="GitHub Auth"
              variant="ghost"
              size="sm"
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white p-0 h-auto font-mono text-xs"
            />
          </div>

          <p className="text-xs text-stone-500 font-mono">
            &copy; {new Date().getFullYear()} ReTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}


