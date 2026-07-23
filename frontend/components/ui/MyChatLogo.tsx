import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  size?: number;
  animated?: boolean;
}

export function MyChatLogo({ className, size = 32, animated = false }: Props) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/favicon.ico"
      alt="MyChat Logo"
      width={size}
      height={size}
      className={cn(
        'shrink-0 object-contain rounded-lg',
        animated ? 'animate-pulse' : '',
        className,
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}
