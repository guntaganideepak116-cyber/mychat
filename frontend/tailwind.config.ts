import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './providers/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Brand Colors (literal hex, usable as bg-brand-blue etc.) ───────────
      colors: {
        'brand-blue': '#2E6FF6',
        'brand-purple': '#9333EA',
        'text-dark': '#0F172A',
        'text-gray': '#6B7280',
        'bg-dark': '#0A0E17',
        'surface-dark': '#151B29',
        'border-dark': '#232B3D',
        'bg-light': '#FFFFFF',
        'surface-light': '#F8FAFC',
        'border-light': '#E2E8F0',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        // ── CSS-var-mapped tokens (for shadcn/ui compatibility) ─────────────
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        alert: 'var(--alert)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      // ── Background Images (brand gradient) ──────────────────────────────
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2E6FF6 0%, #9333EA 100%)',
        'brand-gradient-subtle': 'linear-gradient(135deg, rgba(46,111,246,0.15) 0%, rgba(147,51,234,0.15) 100%)',
      },
      // ── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // ── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['"Chakra Petch"', '"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      // ── Keyframe animations ──────────────────────────────────────────────
      keyframes: {
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)', opacity: '0.9' },
          '100%': { transform: 'rotate(360deg)', opacity: '0.9' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'blink-caret': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(2000%)' },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(46, 111, 246, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(46, 111, 246, 0.45), 0 0 60px rgba(147, 51, 234, 0.2)',
          },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-in-from-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-to-left': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      // ── Animation utilities ───────────────────────────────────────────────
      animation: {
        radar: 'radar-sweep 4s linear infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        caret: 'blink-caret 1s step-end infinite',
        glow: 'glow-pulse 3s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'slide-in': 'slide-in-from-left 0.25s ease-out',
        'slide-out': 'slide-out-to-left 0.25s ease-in',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
