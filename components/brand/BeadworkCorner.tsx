export function BeadworkCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="6" cy="6" r="2.5" fill="#c2410c" />
      <circle cx="20" cy="6" r="2" fill="#f5e6d3" opacity="0.6" />
      <circle cx="34" cy="6" r="1.5" fill="#c2410c" opacity="0.7" />
      <circle cx="48" cy="6" r="1" fill="#f5e6d3" opacity="0.4" />
      <circle cx="6" cy="20" r="2" fill="#f5e6d3" opacity="0.6" />
      <circle cx="20" cy="20" r="1.5" fill="#c2410c" opacity="0.8" />
      <circle cx="34" cy="20" r="1" fill="#f5e6d3" opacity="0.4" />
      <circle cx="6" cy="34" r="1.5" fill="#c2410c" opacity="0.7" />
      <circle cx="20" cy="34" r="1" fill="#f5e6d3" opacity="0.4" />
      <circle cx="6" cy="48" r="1" fill="#f5e6d3" opacity="0.4" />
    </svg>
  );
}