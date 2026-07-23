import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MyChatLogo } from '@/components/ui/MyChatLogo';

export const metadata: Metadata = {
  title: 'Sign In — MyChat',
};

export function generateStaticParams() {
  return [{ 'sign-in': [] }];
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col items-center justify-center px-4 py-12">
      {/* Logo back to home */}
      <Link href="/" className="flex items-center gap-2.5 mb-10 group">
        <MyChatLogo size={32} />
        <span className="font-bold text-xl tracking-tight">
          <span className="text-foreground">My</span>
          <span className="text-brand-gradient">Chat</span>
        </span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to MyChat
          </p>
        </div>
        <SignIn
          routing="hash"
          signUpUrl="/sign-up"
          forceRedirectUrl="/chat"
          fallbackRedirectUrl="/chat"
          appearance={{
            elements: {
              devModeBadge: 'hidden !important',
              card: '!bg-surface !border-border shadow-2xl shadow-brand-blue/10',
              formButtonPrimary: 'bg-brand-gradient hover:brightness-110 text-white font-semibold min-h-[44px]',
              formFieldInput: '!bg-input !border-border text-foreground !text-base focus:!border-brand-blue',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: '!bg-surface !border-border hover:!bg-muted min-h-[44px]',
              footerActionLink: '!text-brand-blue hover:!text-brand-purple',
              footer: '!hidden',
            },
          }}
        />
      </div>
    </div>
  );
}
