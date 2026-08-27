interface LatticeLogoProps {
  className?: string;
  size?: number;
}

export function LatticeLogo({ className = '', size = 24 }: LatticeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lattice Brand Mark"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#1C1917" />
      {/* Orthogonal geometric grid mark */}
      <path
        d="M7 6V18M12 6V18M17 6V18M6 7H18M6 12H18M6 17H18"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
      {/* Focal copper node */}
      <circle cx="12" cy="12" r="2.5" fill="#C2410C" />
      <circle cx="7" cy="7" r="1.5" fill="#FFFFFF" fillOpacity="0.9" />
      <circle cx="17" cy="17" r="1.5" fill="#FFFFFF" fillOpacity="0.9" />
    </svg>
  );
}
