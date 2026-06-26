import Link from "next/link";

type LogoVariant = "full" | "icon" | "wordmark";

interface LogoProps {
  variant?: LogoVariant;
  href?: string;
  className?: string;
  wordmarkClassName?: string;
  iconSize?: number;
}

export function LogoIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src="/veridrop-logo.png"
      alt="Veridrop Logo"
      width={size}
      height={size}
      className={`${className} object-contain`}
    />
  );
}

function Mark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105 hover:-rotate-3"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <LogoIcon size={size} />
    </div>
  );
}

export function Logo({
  variant = "full",
  href = "/",
  className = "",
  wordmarkClassName = "",
  iconSize = 32,
}: LogoProps) {
  if (variant === "icon") {
    return (
      <Link href={href} className={`inline-flex items-center ${className}`} aria-label="Veridrop home">
        <Mark size={iconSize} />
      </Link>
    );
  }

  if (variant === "wordmark") {
    return (
      <Link href={href} className={`inline-flex items-center ${className}`}>
        <span className={`logo-wordmark ${wordmarkClassName}`}>
          <span className="text-brand-blue">Veri</span>
          <span className="text-brand-teal-light">drop</span>
        </span>
      </Link>
    );
  }

  return (
    <Link href={href} className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark size={iconSize} />
      <div className="flex flex-col">
        <span className={`logo-wordmark leading-none ${wordmarkClassName}`}>
          <span className="text-brand-blue">Veri</span>
          <span className="text-brand-teal-light">drop</span>
        </span>
        <span className="text-[8px] font-semibold tracking-[0.25em] text-text-muted leading-none mt-1">
          TRUST INFRASTRUCTURE
        </span>
      </div>
    </Link>
  );
}

export function VeridropLogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <LogoIcon size={44} />
      <div className="flex flex-col">
        <span
          className="logo-wordmark text-xl leading-none"
          style={{ fontFamily: "var(--font-geist-sans), Inter, sans-serif" }}
        >
          <span className="text-brand-blue">Veri</span>
          <span className="text-brand-teal-light">drop</span>
        </span>
        <span className="text-[9px] font-semibold tracking-[0.22em] text-text-muted leading-none mt-1">
          TRUST COMMERCE INFRASTRUCTURE
        </span>
      </div>
    </div>
  );
}
