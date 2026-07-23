import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-primary text-glow">404</h1>
        <h2 className="mt-4 font-display text-xl uppercase tracking-widest text-foreground">
          Signal lost
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This coordinate is not on the grid.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
          >
            Return to base
          </Link>
        </div>
      </div>
    </div>
  );
}
