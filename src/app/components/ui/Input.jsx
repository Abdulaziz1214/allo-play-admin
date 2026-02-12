import React from 'react'

export default function Input({
  label,
  hint,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs text-[var(--muted)]">{label}</label>}

      <input
        className={`w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm outline-none
        focus:ring-2 focus:ring-[var(--ring)]
        placeholder:text-white/30
        ${error ? "border-[var(--primary)]" : ""}
        ${className}`}
        {...props}
      />

      {error ? (
        <p className="text-xs text-[var(--primary)]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--muted)]">{hint}</p>
      ) : null}
    </div>
  );
}
