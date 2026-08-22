"use client";

import Link from "next/link";

export function Logo({
  size = "md",
  href = "/",
  variant = "dark",
}: {
  size?: "sm" | "md" | "lg";
  href?: string;
  variant?: "dark" | "light";
}) {
  const h = size === "sm" ? "h-8" : size === "lg" ? "h-12" : "h-10";
  const img = (
    <img
      src={variant === "light" ? "/logo-light.png" : "/logo.png"}
      alt="AIRSTAY"
      className={`${h} w-auto max-w-[220px] object-contain object-left`}
    />
  );
  if (!href) return img;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="AIRSTAY home">
      {img}
    </Link>
  );
}

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return <img src="/logo-mark.svg" alt="" className={className} />;
}
