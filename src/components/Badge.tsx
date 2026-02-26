import { ReactNode } from "react";

type BadgeVariant = "burgundy" | "gray" | "live";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  burgundy: "bg-burgundy text-white",
  gray: "bg-gray-100 text-gray-600",
  live: "bg-live-red text-white",
};

export default function Badge({
  children,
  variant = "burgundy",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
