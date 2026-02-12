import React from 'react'

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.45)] ${className}`}
    >
      {children}
    </div>
  );
}
