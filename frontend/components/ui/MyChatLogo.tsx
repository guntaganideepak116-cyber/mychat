import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  size?: number;
  animated?: boolean;
}

export function MyChatLogo({ className, size = 32, animated = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-indigo-500 shrink-0', className)}
      aria-label="MyChat Logo"
    >
      <defs>
        <linearGradient id="mychat-logo-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818CF8" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="mychat-spark-grad" x1="16" y1="12" x2="32" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EEF2FF" />
          <stop offset="1" stopColor="#C7D2FE" />
        </linearGradient>
      </defs>
      
      {/* Outer Rounded Container */}
      <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#mychat-logo-grad)" />
      
      {/* Smooth Chat Bubble Path */}
      <path
        d="M14 18C14 15.7909 15.7909 14 18 14H30C32.2091 14 34 15.7909 34 18V26C34 28.2091 32.2091 30 30 30H23.5L18.5 34V30H18C15.7909 30 14 28.2091 14 26V18Z"
        fill="url(#mychat-spark-grad)"
        className={animated ? 'animate-pulse' : ''}
      />
      
      {/* Sparkle Accent inside Bubble */}
      <path
        d="M24 18.5L25.2 21.8L28.5 23L25.2 24.2L24 27.5L22.8 24.2L19.5 23L22.8 21.8L24 18.5Z"
        fill="#4F46E5"
      />
    </svg>
  );
}
