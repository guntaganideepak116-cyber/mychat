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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-indigo-500/20 selection:text-indigo-500">
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <MyChatLogo size={32} />
            <span className="font-semibold text-lg tracking-tight text-foreground group-hover:text-indigo-500 transition-colors">
              MyChat
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border/60 bg-surface hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              aria-label="Toggle theme"
              title="Toggle Light/Dark Mode"
            >
              {isLightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 2. HERO SECTION */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
          {/* Ambient Radial Gradient Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />
          <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none -z-10" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-500 mb-8 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Meet your new personal AI assistant</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Your AI. <span className="text-gradient">Always Ready.</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Ask anything, get instant streaming answers, and pick up conversations right where you left off. Simple, personal, and fast.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/chat"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageSquare className="h-5 w-5" />
                Start Chatting Free
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-surface/80 px-7 py-3.5 text-base font-semibold text-foreground hover:bg-muted transition-all"
              >
                How It Works
              </a>
            </div>

            {/* Hero Visual Mockup */}
            <div className="mt-16 sm:mt-20 mx-auto max-w-4xl">
              <div className="relative rounded-2xl border border-border/70 bg-card p-2 sm:p-4 shadow-2xl shadow-indigo-500/10">
                {/* Mockup Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-md">
                    <MyChatLogo size={14} />
                    <span>MyChat Assistant</span>
                  </div>
                  <div className="w-12" />
                </div>

                {/* Mockup Conversation */}
                <div className="space-y-4 text-left p-2 sm:p-4 font-sans text-sm">
                  {/* User Message */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-indigo-600 text-white px-4 py-3 max-w-[85%] sm:max-w-[70%] shadow-sm">
                      How can I structure a clean Next.js + Express project for scale?
                    </div>
                    <div className="h-8 w-8 rounded-full bg-indigo-500/20 grid place-items-center text-indigo-500 shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start gap-3 justify-start">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 grid place-items-center text-white shrink-0 shadow-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3 max-w-[85%] sm:max-w-[80%] space-y-2 text-foreground shadow-sm">
                      <p className="leading-relaxed">
                        A clean monorepo architecture with decoupled top-level directories is ideal:
                      </p>
                      <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground list-disc list-inside">
                        <li><strong className="text-foreground">/frontend</strong>: Next.js 14 App Router for modern UI & Server Components</li>
                        <li><strong className="text-foreground">/backend</strong>: Express + TypeScript API for SSE streaming & database access</li>
                      </ul>
                      <div className="flex items-center gap-1.5 text-xs text-indigo-500 pt-1 font-medium">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Responded in 0.3s</span>
                      </div>
                    </div>
                  </div>

                  {/* Animated Typing Indicator Mock */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pl-11">
                    <span>MyChat is thinking</span>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-typing-1" />
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-typing-2" />
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-typing-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FEATURES SECTION */}
        <section className="py-20 bg-surface/40 border-y border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Everything you need in a personal AI
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                Designed for simplicity, speed, and privacy. No complicated settings — just open and chat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm hover:shadow-md hover:border-indigo-500/40 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-500 grid place-items-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                  Real-Time Responses
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Experience instant token-by-token response streaming. Answers appear as fast as you can read them.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm hover:shadow-md hover:border-indigo-500/40 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-500 grid place-items-center mb-6 group-hover:scale-110 transition-transform">
                  <History className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                  Remembers Everything
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Full conversation history saved automatically. Search, pin, and resume any discussion whenever you want.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm hover:shadow-md hover:border-indigo-500/40 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-500 grid place-items-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                  Private & Secure
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Authenticated with Clerk and backed by encrypted cloud storage. Your data remains strictly yours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
                Simple 3-Step Process
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                How MyChat Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="relative text-center p-6">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-indigo-600 text-white font-bold text-xl grid place-items-center shadow-lg shadow-indigo-500/20 mb-6">
                  1
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Sign In Fast</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Log in securely using Google, GitHub, or email in just one click.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center p-6">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-indigo-600 text-white font-bold text-xl grid place-items-center shadow-lg shadow-indigo-500/20 mb-6">
                  2
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Ask Anything</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Type your prompt, ask for advice, or request code solutions instantly.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center p-6">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-indigo-600 text-white font-bold text-xl grid place-items-center shadow-lg shadow-indigo-500/20 mb-6">
                  3
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Get Instant Answers</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Watch intelligent answers stream in real-time with full markdown support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FINAL CTA SECTION */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 sm:p-16 text-center text-white overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to start chatting?
              </h2>
              <p className="text-indigo-100 text-base sm:text-lg">
                Join now and experience your personal AI assistant in action.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-indigo-600 shadow-md hover:bg-indigo-50 transition-all active:scale-[0.98]"
                >
                  Start Chatting Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="pt-2 flex items-center justify-center gap-6 text-xs text-indigo-200">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> No credit card required</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Instant setup</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. FOOTER */}
      <footer className="border-t border-border/50 py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <MyChatLogo size={24} />
            <span className="font-semibold tracking-tight text-foreground">MyChat</span>
            <span className="text-xs text-muted-foreground">· Personal AI Assistant</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Built for intelligent, fast conversations. Powered by Next.js & OpenRouter.
          </p>
        </div>
      </footer>
    </div>
  );
}
