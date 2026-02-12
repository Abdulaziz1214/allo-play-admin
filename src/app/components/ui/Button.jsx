import React from 'react'

export default function Button({
  children,
  variant = "primary", // primary | secondary | ghost
  type = "button",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white",
    secondary:
      "bg-[var(--surface-2)] hover:bg-[#222235] text-[var(--text)] border border-[var(--border)]",
    ghost: "bg-transparent hover:bg-[var(--surface-2)] text-[var(--text)]",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
