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
  CaretRightIcon,
  LockIcon,
  SquaresFourIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  ArrowUpRightIcon,
  CheckIcon,
  FileCodeIcon,
  BrainIcon,
  GitForkIcon,
  BugIcon,
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
    <div className="min-h-screen bg-[#070709] text-zinc-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 relative overflow-x-hidden">
      {/* Background Glow Accents */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(120,119,198,0.18),rgba(255,255,255,0))] z-0" />
      <div className="pointer-events-none absolute top-96 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl z-0" />
      <div className="pointer-events-none absolute top-80 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl z-0" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070709]/80 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative size-9 rounded-xl overflow-hidden border border-white/10 bg-zinc-900 shadow-md group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/retrack-logo.png"
                alt="ReTrack logo"
                width={36}
                height={36}
                className="object-cover"
                priority
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                ReTrack
              </span>
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-300 border-purple-500/20 text-[10px] font-mono px-2 py-0.5">
                AI Beta
              </Badge>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How it works
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              Architecture
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            {session?.user ? (
              <div className="flex items-center gap-3">
                <Button asChild variant="outline" size="sm" className="rounded-full border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 text-xs">
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
                  className="text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-full px-4 text-xs"
                />
                <GithubAuthButton
                  label="Sign Up with GitHub"
                  variant="default"
                  size="sm"
                  className="rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-xs px-4 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6 max-w-7xl mx-auto text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-8 backdrop-blur-sm animate-fade-in shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <SparkleIcon className="size-3.5 text-purple-400 animate-pulse" />
          <span>Vector-Powered Contextual AI Code Reviewer</span>
          <span className="text-purple-400/50">|</span>
          <span className="text-zinc-400 font-mono">1-Click GitHub Setup</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Automate PR Reviews with <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-white to-emerald-300">
            Full Repository Context
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          ReTrack indexes your GitHub codebase with Pinecone vector embeddings to catch bugs, security vulnerabilities, and architectural flaws before you merge.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {session?.user ? (
            <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-zinc-200 font-semibold px-8 py-6 text-base shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-transform hover:scale-105">
              <Link href="/dashboard">
                Go to Dashboard <ArrowRightIcon className="size-5 ml-2" />
              </Link>
            </Button>
          ) : (
            <GithubAuthButton
              label="Sign Up with GitHub"
              size="lg"
              className="rounded-full bg-white text-black hover:bg-zinc-200 font-semibold px-8 py-6 text-base shadow-[0_0_35px_rgba(255,255,255,0.2)] transition-transform hover:scale-105"
            />
          )}

          <a href="#how-it-works">
            <Button variant="outline" size="lg" className="rounded-full border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-300 hover:text-white px-7 py-6 text-base backdrop-blur-sm">
              <GitPullRequestIcon className="size-5 mr-2 text-emerald-400" />
              See How It Works
            </Button>
          </a>
        </div>

        {/* Command Line Helper Banner */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800/80 font-mono text-xs text-zinc-400 mb-16 shadow-lg">
          <TerminalWindowIcon className="size-4 text-purple-400" />
          <span>Quick Install:</span>
          <code className="text-zinc-200">npx retrack-cli@latest init</code>
          <button
            onClick={handleCopyInstall}
            className="ml-2 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors text-[11px]"
            title="Copy command"
          >
            {copiedInstall ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Hero Code Review Interactive Simulator */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#0c0c0f] p-2 sm:p-3 shadow-[0_20px_80px_rgba(0,0,0,0.8)] text-left relative group">
          {/* Top Bar Window Decorator */}
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-800/80 bg-[#121216] px-4 py-3 rounded-t-xl gap-2">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="size-3 rounded-full bg-yellow-500/80 inline-block"></span>
              <span className="size-3 rounded-full bg-green-500/80 inline-block"></span>
              <span className="ml-2 font-mono text-xs text-zinc-400 flex items-center gap-1.5">
                <GitPullRequestIcon className="size-4 text-emerald-400" />
                retrack-org / code-reviewer · <span className="text-zinc-200">PR #42</span>
              </span>
            </div>

            {/* Simulator Tabs */}
            <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800/80 text-xs font-mono">
              <button
                onClick={() => setActiveTab("diff")}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors",
                  activeTab === "diff"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                Code Diff & AI Fix
              </button>
              <button
                onClick={() => setActiveTab("summary")}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors",
                  activeTab === "summary"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                AI Review Summary
              </button>
              <button
                onClick={() => setActiveTab("context")}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors",
                  activeTab === "context"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                Pinecone Vectors
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm bg-[#0a0a0c] rounded-b-xl overflow-x-auto min-h-[320px]">
            {activeTab === "diff" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-500 pb-2 border-b border-zinc-900">
                  <span>File: <code className="text-zinc-300">features/auth/actions/index.ts</code></span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    +12 lines | -4 lines
                  </span>
                </div>

                {/* Diff Lines */}
                <div className="space-y-1 font-mono text-xs sm:text-sm leading-relaxed">
                  <div className="text-zinc-600 select-none">@@ -14,6 +14,14 @@ export async function signInWithGithub(formData: FormData) &#123;</div>
                  <div className="text-zinc-400 pl-4">  const callbackValue = formData.get("callbackUrl");</div>
                  <div className="bg-red-950/40 text-red-300 border-l-2 border-red-500 pl-4 py-1 flex items-center justify-between">
                    <span>- const redirectTo = callbackValue || "/dashboard"; // Unsanitized URL redirect</span>
                    <span className="text-[10px] text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded">Security Risk</span>
                  </div>
                  <div className="bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500 pl-4 py-1">
                    <span>+ const redirectTo = getSafeCallbackUrlPath(callbackValue); // Open-redirect protected</span>
                  </div>
                  <div className="text-zinc-400 pl-4">  const res = await auth.api.signInSocial(&#123;</div>
                  <div className="text-zinc-400 pl-4">    body: &#123; provider: "github", callbackURL: redirectTo &#125;,</div>
                </div>

                {/* ReTrack AI Bot Comment Card */}
                <div className="mt-4 rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 relative shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-md bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                        <SparkleIcon className="size-3.5" />
                      </div>
                      <span className="font-semibold text-xs text-purple-200">ReTrack AI Reviewer</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                        99.2% Vector Context Match
                      </Badge>
                    </div>
                    <span className="text-[11px] text-zinc-400">Just now</span>
                  </div>

                  <p className="text-xs text-zinc-300 mb-3 leading-normal">
                    ⚠️ <strong>Security Advisory:</strong> Prevents potential open redirect vulnerabilities by using <code className="bg-purple-900/40 text-purple-200 px-1 rounded">getSafeCallbackUrlPath()</code> from <code className="text-zinc-300">features/auth/utils</code>. Verified against your repo&apos;s authentication standards.
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-purple-500/20 text-xs">
                    <Button size="sm" className="h-7 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs gap-1">
                      <CheckIcon className="size-3" /> Auto-approve PR
                    </Button>
                    <span className="text-zinc-500 text-[11px]">Indexed via Pinecone vector namespace <code className="text-zinc-400 font-mono">repo_retrack_v1</code></span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                      <BrainIcon className="size-4 text-purple-400" /> Executive Code Review Analysis
                    </h4>
                    <span className="text-xs text-emerald-400 font-mono">Status: PASS (With 1 Suggestion)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Architecture:</strong> Correctly adheres to Next.js 16 Server Actions patterns.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Performance:</strong> Zero extra DB queries added; utilizes cached Better-Auth session.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheckIcon className="size-4 text-purple-400 shrink-0 mt-0.5" />
                      <span><strong>Security Audit:</strong> Fixed open redirect parameter sanitization. No secrets exposed.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "context" && (
              <div className="space-y-3 font-mono text-xs">
                <div className="text-zinc-400">Pinecone Vector Index Queries executed for PR #42:</div>
                <div className="p-3 rounded bg-zinc-950 border border-zinc-800/80 space-y-2 text-zinc-300">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>1. Query: &quot;auth redirect safety utility&quot;</span>
                    <span className="text-purple-400">Score: 0.984</span>
                  </div>
                  <div className="text-emerald-400 text-[11px] pl-4">→ Match: features/auth/utils/index.ts (Line 6-11)</div>

                  <div className="flex items-center justify-between text-zinc-400 pt-2 border-t border-zinc-900">
                    <span>2. Query: &quot;BetterAuth social signin provider callback&quot;</span>
                    <span className="text-purple-400">Score: 0.951</span>
                  </div>
                  <div className="text-emerald-400 text-[11px] pl-4">→ Match: lib/auth.ts & lib/auth-client.ts</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Metrics & Social Proof Section */}
      <section className="border-y border-white/[0.08] bg-zinc-950/50 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1 font-mono">&lt; 30s</div>
            <div className="text-sm text-zinc-400">Average Review Time</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 mb-1 font-mono">100%</div>
            <div className="text-sm text-zinc-400">Full Repo Vector Context</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1 font-mono">0 Config</div>
            <div className="text-sm text-zinc-400">Instant GitHub Webhooks</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1 font-mono">1-Click</div>
            <div className="text-sm text-zinc-400">GitHub Sign-In & Sync</div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20 text-xs px-3 py-1 mb-4">
            Engineered for Developers
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Why ReTrack Superior Code Reviews
          </h2>
          <p className="text-zinc-400 text-lg">
            Traditional AI tools review diffs blindly. ReTrack indexes your entire codebase architecture to provide accurate, context-aware PR reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-8 hover:border-purple-500/40 transition-all group backdrop-blur-sm">
            <div className="size-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <CpuIcon className="size-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Pinecone Vector Indexing</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Every commit and file is embedded into Pinecone vector storage. ReTrack retrieves matching modules, existing utility functions, and type definitions before generating feedback.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-8 hover:border-emerald-500/40 transition-all group backdrop-blur-sm">
            <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <LightningIcon className="size-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Instant Automated PR Comments</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Powered by Inngest background workers. As soon as a Pull Request is opened or updated on GitHub, ReTrack posts structured inline suggestions directly on your code lines.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-8 hover:border-purple-500/40 transition-all group backdrop-blur-sm">
            <div className="size-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheckIcon className="size-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Security & Vulnerability Detection</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Catch security flaws, exposed API keys, unhandled promise rejections, memory leaks, and breaking API changes before code reaches production.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-8 hover:border-emerald-500/40 transition-all group backdrop-blur-sm">
            <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <GithubLogoIcon className="size-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Single-Click GitHub OAuth</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              No complex setup or password management. Simply sign in with your GitHub account, select your repositories, and start reviewing code in under 60 seconds.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-8 hover:border-purple-500/40 transition-all group backdrop-blur-sm">
            <div className="size-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <CodeIcon className="size-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Custom Guidelines & Rules</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Enforce your team&apos;s coding standards. Define custom review rules, naming conventions, and architectural constraints tailored to your project.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-8 hover:border-emerald-500/40 transition-all group backdrop-blur-sm">
            <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <SquaresFourIcon className="size-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Developer Dashboard</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Monitor PR quality metrics, track connected repositories, view past review logs, and manage team subscriptions from one intuitive dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-zinc-950/60 border-y border-white/[0.08] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs px-3 py-1 mb-4">
              Simple 4-Step Workflow
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Get Started in Seconds
            </h2>
            <p className="text-zinc-400 text-lg">
              Seamlessly integrates into your existing GitHub developer workflow with single sign-on.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm">
              <div className="font-mono text-3xl font-bold text-purple-400 mb-4">01</div>
              <h3 className="text-lg font-semibold text-white mb-2">Sign In with GitHub</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Click our single GitHub OAuth button to authorize ReTrack. No passwords or credit cards needed.
              </p>
              <GithubAuthButton label="Sign In Now" size="sm" variant="outline" className="w-full text-xs rounded-lg border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white" />
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm">
              <div className="font-mono text-3xl font-bold text-emerald-400 mb-4">02</div>
              <h3 className="text-lg font-semibold text-white mb-2">Connect Repositories</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Select public or private repositories from your GitHub account for ReTrack to monitor.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm">
              <div className="font-mono text-3xl font-bold text-purple-400 mb-4">03</div>
              <h3 className="text-lg font-semibold text-white mb-2">Vector Codebase Indexing</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                ReTrack automatically parses your code structure and generates Pinecone vector embeddings.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm">
              <div className="font-mono text-3xl font-bold text-emerald-400 mb-4">04</div>
              <h3 className="text-lg font-semibold text-white mb-2">Open a PR & Get Feedback</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Open a Pull Request on GitHub. ReTrack analyzes diffs and posts line-by-line comments instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Access Callout */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20 text-xs px-3 py-1 mb-4">
            Transparent Pricing
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Start Reviewing Code for Free
          </h2>
          <p className="text-zinc-400 text-lg">
            Get instant AI code reviews for your GitHub repositories today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Starter</h3>
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700">Free Forever</Badge>
              </div>
              <div className="font-mono text-4xl font-extrabold text-white mb-6">$0 <span className="text-sm text-zinc-400 font-sans font-normal">/ month</span></div>

              <ul className="space-y-3 text-sm text-zinc-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-emerald-400 shrink-0" /> Up to 3 GitHub Repositories
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-emerald-400 shrink-0" /> Unlimited PR Automated Reviews
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-emerald-400 shrink-0" /> Standard Pinecone Vector Indexing
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-emerald-400 shrink-0" /> Single GitHub Sign-In Access
                </li>
              </ul>
            </div>

            <GithubAuthButton
              label="Sign Up with GitHub (Free)"
              className="w-full rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold py-3"
            />
          </div>

          {/* Pro Tier */}
          <div className="rounded-3xl border border-purple-500/40 bg-purple-950/10 p-8 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)]">
            <div className="absolute top-0 right-0 bg-purple-600 text-white font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl">
              Recommended
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Pro Developer</h3>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40">Popular</Badge>
              </div>
              <div className="font-mono text-4xl font-extrabold text-white mb-6">₹999 <span className="text-sm text-zinc-400 font-sans font-normal">/ month</span></div>

              <ul className="space-y-3 text-sm text-zinc-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-purple-400 shrink-0" /> Unlimited GitHub Repositories
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-purple-400 shrink-0" /> Priority Pinecone Vector Search
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-purple-400 shrink-0" /> Custom Team Rules & Guidelines
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-purple-400 shrink-0" /> In-depth Security & OWASP Audits
                </li>
              </ul>
            </div>

            <GithubAuthButton
              label="Get Started with Pro"
              className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            />
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center relative z-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-10 sm:p-16 relative overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)]" />

          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
            Ready to Upgrade Your GitHub Pull Request Reviews?
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8">
            Connect your GitHub account in one click and experience context-aware AI code reviews instantly.
          </p>

          <GithubAuthButton
            label="Sign Up with GitHub Now"
            size="lg"
            className="rounded-full bg-white text-black hover:bg-zinc-200 font-semibold px-9 py-6 text-lg shadow-[0_0_35px_rgba(255,255,255,0.25)] transition-transform hover:scale-105"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#050507] py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/retrack-logo.png"
              alt="ReTrack logo"
              width={28}
              height={28}
              className="rounded-lg object-cover"
            />
            <span className="font-semibold text-white text-sm">ReTrack · AI Code Reviewer</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-500 font-mono">
            <span>Powered by Pinecone & Better Auth</span>
            <span>·</span>
            <GithubAuthButton
              label="GitHub Auth"
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white p-0 h-auto font-mono text-xs"
            />
          </div>

          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} ReTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

