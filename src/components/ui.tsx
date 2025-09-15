import React from "react";
import clsx from "clsx";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={clsx(
      "rounded-2xl border border-white/20 backdrop-blur-md shadow-xl", 
      "bg-white/95 dark:bg-neutral-900/95", 
      className
    )}
    {...props}
  />
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-medium rounded-xl whitespace-nowrap select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-gold)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200";
  const sizes: Record<string, string> = {
    md: "text-sm px-6 h-11",
    sm: "text-xs px-4 h-9",
  };
  const variants: Record<string, string> = {
    primary:
      "text-white bg-[var(--brand-green)] hover:bg-[var(--brand-green-alt)] shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-[var(--brand-green)] text-[var(--brand-green)] hover:bg-[var(--brand-green)] hover:text-white",
    ghost: "text-[var(--brand-green)] hover:bg-[var(--brand-green)]/10",
  };
  return (
    <button className={clsx(base, sizes[size], variants[variant], className)} {...props} />
  );
};

export const SectionHeading: React.FC<{ title: string; subtitle?: string; className?: string }>=({title, subtitle, className}) => (
  <div className={clsx("space-y-2", className)}>
    <h2 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-white">{title}</h2>
    {subtitle && <p className="text-sm text-slate-600 dark:text-neutral-300">{subtitle}</p>}
  </div>
);
