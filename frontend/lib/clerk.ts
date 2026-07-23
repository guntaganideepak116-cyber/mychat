/**
 * Clerk configuration and styling theme.
 * Uses brand color #2E6FF6 (blue) as primary.
 */
export const CLERK_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined;

export const clerkAppearance = {
  variables: {
    colorPrimary: '#2E6FF6',
    colorBackground: '#0A0E17',
    colorInputBackground: '#151B29',
    colorInputText: '#F1F5F9',
    colorText: '#F1F5F9',
    colorTextSecondary: '#64748B',
    colorNeutral: '#64748B',
    borderRadius: '0.75rem',
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
    fontFamilyButtons: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
    fontSize: '16px',
  },
  elements: {
    card: 'bg-surface border border-border shadow-2xl shadow-brand-blue/10',
    headerTitle: 'text-foreground font-bold',
    headerSubtitle: 'text-muted-foreground text-sm',
    socialButtonsBlockButton:
      'bg-surface border border-border text-foreground hover:bg-muted transition-colors',
    socialButtonsBlockButtonText: 'text-foreground font-medium',
    formButtonPrimary:
      'bg-brand-gradient text-white font-semibold hover:brightness-110 transition-all min-h-[44px]',
    formFieldInput:
      'bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-base',
    footerActionLink: 'text-primary hover:text-primary/80',
    identityPreviewEditButton: 'text-primary',
    dividerLine: 'bg-border',
    dividerText: 'text-muted-foreground',
    devModeBadge: 'hidden !important',
    internalDevModeBadge: 'hidden !important',
    footer: 'hidden !important',
  },
} as const;
