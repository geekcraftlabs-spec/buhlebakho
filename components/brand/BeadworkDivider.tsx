export function BeadworkDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden>
      <span className="h-px w-16 bg-sand/15" />
      <span className="w-2 h-2 rounded-full bg-terracotta/80" />
      <span className="w-1.5 h-1.5 rounded-full bg-sand/40" />
      <span className="w-2 h-2 rounded-full bg-terracotta/80" />
      <span className="h-px w-16 bg-sand/15" />
    </div>
  );
}