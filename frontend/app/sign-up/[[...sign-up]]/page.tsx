import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MyChatLogo } from '@/components/ui/MyChatLogo';

export const metadata: Metadata = {
  title: 'Sign Up — MyChat',
};

export function generateStaticParams() {
  return [{ 'sign-up': [] }];
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <MyChatLogo size={28} />
        <span className="font-display uppercase tracking-[0.25em] text-sm">MyChat</span>
      </Link>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary">
            {'// New Operator Registration'}
          </div>
          <h1 className="mt-2 font-display text-2xl uppercase tracking-tight">
            Request Clearance
          </h1>
        </div>
        <SignUp
          routing="hash"
          signInUrl="/sign-in"
          forceRedirectUrl="/chat"
        />
      </div>
    </div>
  );
}
