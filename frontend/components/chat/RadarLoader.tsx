export function RadarLoader({ size = 24 }: { size?: number }) {
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full border border-primary/40" />
      <div
        className="absolute inset-0 rounded-full animate-radar"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--primary) 60%, transparent) 60deg, transparent 90deg)',
        }}
      />
      <div className="absolute w-1 h-1 rounded-full bg-primary" />
    </div>
  );
}
