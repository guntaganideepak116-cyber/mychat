import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  size?: number;
  animated?: boolean;
  /** Render the "MyChat" wordmark alongside the icon */
  showWordmark?: boolean;
}

export function MyChatLogo({ className, size = 32, animated = false, showWordmark = false }: Props) {
  const icon = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/favicon.ico"
      alt="MyChat Logo"
      width={size}
      height={size}
      className={cn(
        'shrink-0 object-contain rounded-lg',
        animated ? 'animate-pulse' : '',
        !showWordmark && className,
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );

  if (!showWordmark) return icon;

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      {icon}
      <span
        className="font-bold tracking-tight leading-none"
        style={{ fontSize: `${Math.round(size * 0.55)}px` }}
      >
        <span className="text-foreground">My</span>
        <span className="text-brand-gradient">Chat</span>
      </span>
    </span>
  );
}
