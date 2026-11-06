import type { InputHTMLAttributes, ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function AuthShell({ title, subtitle, children, tone = "default" }: { title: string; subtitle?: string; children: ReactNode; tone?: "default" | "admin" }) {
  return (
    <div className="site-content page-enter relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="mouse-spotlight" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="mb-8 block text-center font-display text-lg font-extrabold">🃏 Jester<span className="text-amber">.</span></Link>
        <div className={`glass rounded-xl p-8 ${tone === "admin" ? "border-amber/50 shadow-[0_0_60px_-20px_var(--amber)]" : ""}`}>
          {tone === "admin" && <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-amber">Restricted area</p>}
          <h1 className="text-2xl font-extrabold">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-bold text-muted-foreground">{label}</span>
      <input {...props} className="w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-foreground outline-none transition focus:border-amber focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--amber)_25%,transparent)]" />
    </label>
  );
}

export function SubmitBtn({ children, busy }: { children: ReactNode; busy?: boolean }) {
  return (
    <button type="submit" disabled={busy} className="w-full rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary)] hover:brightness-125 disabled:opacity-60">
      {busy ? "Please wait…" : children}
    </button>
  );
}
