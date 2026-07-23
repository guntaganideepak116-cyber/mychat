'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import {
  Zap,
  History,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Moon,
  Sun,
  User,
  Bot,
} from 'lucide-react';
import { MyChatLogo } from '@/components/ui/MyChatLogo';

export default function LandingPage() {
  const [isLightMode, setIsLightMode] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // Auto-redirect signed in users directly to /chat
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/chat');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('mychat_theme');
    const isLight = savedTheme === 'light' || document.documentElement.classList.contains('light');
    setIsLightMode(isLight);
    if (isLight) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextLight = !isLightMode;
    setIsLightMode(nextLight);
    if (nextLight) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mychat_theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('mychat_theme', 'dark');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      {/* ── 1. NAVBAR ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo + wordmark */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <MyChatLogo size={28} />
            <span className="font-bold text-base sm:text-lg tracking-tight whitespace-nowrap">
              <span className="text-foreground">My</span>
              <span className="text-brand-gradient">Chat</span>
            </span>
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Theme Toggle — 44px tap target */}
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg border border-border/60 bg-surface hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0"
              aria-label="Toggle theme"
              title="Toggle Light/Dark Mode"
            >
              {isLightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Sign In — hidden on mobile to save space */}
            <Link
              href="/sign-in"
              className="hidden sm:flex h-10 items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 whitespace-nowrap"
            >
              Sign In
            </Link>

            {/* Get Started — always visible, no text wrap */}
            <Link
              href="/sign-up"
              className="inline-flex h-10 sm:h-11 items-center justify-center gap-1 sm:gap-1.5 rounded-lg bg-brand-gradient px-3 sm:px-5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:brightness-110 transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── 2. HERO SECTION ── */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
          {/* Ambient glow blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(800px,100vw)] h-[500px] bg-gradient-to-tr from-brand-blue/15 via-brand-purple/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />
          <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none -z-10" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3.5 py-1.5 text-xs font-medium text-brand-blue mb-8 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>Meet your new personal AI assistant</span>
            </div>

            {/* Main Headline — scales from mobile to desktop */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Your AI.{' '}
              <span className="text-gradient">Always Ready.</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              Ask anything, get instant streaming answers, and pick up conversations right where you left off. Simple, personal, and fast.
            </p>

            {/* CTA Buttons — stacked on mobile, row on sm+ */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Link
                href="/chat"
                className="w-full sm:w-auto inline-flex h-12 sm:h-auto items-center justify-center gap-2 rounded-xl bg-brand-gradient px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-blue/25 hover:brightness-110 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageSquare className="h-5 w-5 shrink-0" />
                Start Chatting Free
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex h-12 sm:h-auto items-center justify-center gap-2 rounded-xl border border-border bg-surface/80 px-7 py-3.5 text-base font-semibold text-foreground hover:bg-muted transition-all"
              >
                How It Works
              </a>
            </div>

            {/* Hero Visual Mockup */}
            <div className="mt-16 sm:mt-20 mx-auto max-w-4xl px-2 sm:px-0">
              <div className="relative rounded-2xl border border-border/70 bg-card p-2 sm:p-4 shadow-2xl shadow-brand-blue/10">
                {/* Mockup Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-md">
                    <MyChatLogo size={14} />
                    <span className="hidden xs:inline">MyChat Assistant</span>
                    <span className="xs:hidden">MyChat</span>
                  </div>
                  <div className="w-14" />
                </div>

                {/* Mockup Conversation */}
                <div className="space-y-4 text-left p-2 sm:p-4 font-sans text-sm overflow-hidden">
                  {/* User Message */}
                  <div className="flex items-start gap-2 sm:gap-3 justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-brand-gradient text-white px-3 sm:px-4 py-3 max-w-[85%] sm:max-w-[70%] shadow-sm text-sm break-words">
                      How can I structure a clean Next.js + Express project for scale?
                    </div>
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-brand-blue/20 grid place-items-center text-brand-blue shrink-0">
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start gap-2 sm:gap-3 justify-start">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-brand-gradient grid place-items-center text-white shrink-0 shadow-sm">
                      <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm border border-border bg-surface px-3 sm:px-4 py-3 max-w-[85%] sm:max-w-[80%] space-y-2 text-foreground shadow-sm">
                      <p className="leading-relaxed text-xs sm:text-sm">
                        A clean monorepo architecture with decoupled top-level directories is ideal:
                      </p>
                      <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                        <li><strong className="text-foreground">/frontend</strong>: Next.js 14 App Router</li>
                        <li><strong className="text-foreground">/backend</strong>: Express + TypeScript API</li>
                      </ul>
                      <div className="flex items-center gap-1.5 text-xs text-brand-blue pt-1 font-medium">
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        <span>Responded in 0.3s</span>
                      </div>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pl-9 sm:pl-11">
                    <span>MyChat is thinking</span>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full animate-typing-1" />
                      <span className="h-1.5 w-1.5 rounded-full animate-typing-2" />
                      <span className="h-1.5 w-1.5 rounded-full animate-typing-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. FEATURES SECTION ── */}
        <section className="py-20 bg-surface/40 border-y border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Everything you need in a personal AI
              </h2>
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground">
                Designed for simplicity, speed, and privacy. No complicated settings — just open and chat.
              </p>
            </div>

            {/* Grid: 1 col mobile → 2 col tablet → 3 col desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-brand-blue/40 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-brand-blue/10 text-brand-blue grid place-items-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-2">
                  Real-Time Responses
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Experience instant token-by-token response streaming. Answers appear as fast as you can read them.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-brand-blue/40 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-brand-blue/10 text-brand-blue grid place-items-center mb-6 group-hover:scale-110 transition-transform">
                  <History className="h-6 w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-2">
                  Remembers Everything
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Full conversation history saved automatically. Search, pin, and resume any discussion whenever you want.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-brand-blue/40 transition-all group sm:col-span-2 lg:col-span-1">
                <div className="h-12 w-12 rounded-xl bg-brand-blue/10 text-brand-blue grid place-items-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-2">
                  Private &amp; Secure
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Authenticated with Clerk and backed by encrypted cloud storage. Your data remains strictly yours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. HOW IT WORKS SECTION ── */}
        <section id="how-it-works" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
                Simple 3-Step Process
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                How MyChat Works
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
              {[
                { n: 1, title: 'Sign In Fast', desc: 'Log in securely using Google, GitHub, or email in just one click.' },
                { n: 2, title: 'Ask Anything', desc: 'Type your prompt, ask for advice, or request code solutions instantly.' },
                { n: 3, title: 'Get Instant Answers', desc: 'Watch intelligent answers stream in real-time with full markdown support.' },
              ].map(({ n, title, desc }) => (
                <div key={n} className="relative text-center p-6">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-brand-gradient text-white font-bold text-xl grid place-items-center shadow-lg shadow-brand-blue/20 mb-6">
                    {n}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. FINAL CTA SECTION ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-3xl bg-brand-gradient p-8 sm:p-16 text-center text-white overflow-hidden shadow-2xl shadow-brand-blue/30">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-48 h-48 rounded-full bg-brand-purple/30 blur-2xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Ready to start chatting?
              </h2>
              <p className="text-white/80 text-sm sm:text-base lg:text-lg">
                Join now and experience your personal AI assistant in action.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <Link
                  href="/chat"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-brand-blue shadow-md hover:bg-white/90 transition-all active:scale-[0.98]"
                >
                  Start Chatting Now
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-white/70">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  Instant setup
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── 6. FOOTER ── */}
      <footer className="border-t border-border/50 py-10 sm:py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <MyChatLogo size={24} />
            <span className="font-bold tracking-tight text-foreground">
              <span>My</span>
              <span className="text-brand-gradient">Chat</span>
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">· Personal AI Assistant</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built for intelligent, fast conversations. Powered by Next.js &amp; OpenRouter.
          </p>
        </div>
      </footer>
    </div>
  );
}
