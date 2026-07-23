/**
 * Clerk configuration.
 * Env var renamed from VITE_CLERK_PUBLISHABLE_KEY → NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.
 * NEXT_PUBLIC_ prefix is required for the value to be available in the browser bundle.
 */
export const CLERK_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined;

export const clerkAppearance = {
  variables: {
    colorPrimary: '#00D9C0',
    colorBackground: '#141a20',
    colorInputBackground: '#1a2128',
    colorInputText: '#e8f4f2',
    colorText: '#e8f4f2',
    colorTextSecondary: '#8ea3ad',
    colorNeutral: '#e8f4f2',
    borderRadius: '0.5rem',
    fontFamily: 'Inter, ui-sans-serif, system-ui',
  },
  elements: {
    rootBox: 'w-full',
    card: 'bg-surface border border-border shadow-2xl',
    headerTitle: 'font-display text-foreground',
    headerSubtitle: 'text-muted-foreground',
    socialButtonsBlockButton:
      'bg-surface-elevated border border-border hover:bg-muted text-foreground',
    formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground font-medium',
    formFieldInput: 'bg-input border-border text-foreground',
    footerActionLink: 'text-primary hover:text-primary/80',
    identityPreviewEditButton: 'text-primary',
    dividerLine: 'bg-border',
    dividerText: 'text-muted-foreground',
  },
} as const;
