import type { InputHTMLAttributes, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import bgUser from "@/assets/progress-after-full-2.jpg.asset.json";
import bgAdmin from "@/assets/progress-after-full-5.jpg.asset.json";

export function AuthShell({ title, subtitle, children, tone = "default" }: { title: string; subtitle?: string; children: ReactNode; tone?: "default" | "admin" }) {
  return (
    <div className={`site-content cinema auth-stage ${tone === "admin" ? "auth-admin" : ""}`}>
      <div className="auth-visual" aria-hidden="true">
        <img src={tone === "admin" ? bgAdmin.url : bgUser.url} alt="" />
        <div className="auth-visual-veil" />
        <div className="auth-visual-copy">
          <p className="eyebrow"><span className="eyebrow-n">{tone === "admin" ? "00" : "∞"}</span><span className="eyebrow-line" />{tone === "admin" ? "Staff only" : "Konnect Us"}</p>
          <h2 className="mt-5">{tone === "admin" ? <>Behind<br /><span className="font-serif-i text-blood">the curtain</span></> : <>Join the<br /><span className="font-serif-i text-blood">jesters</span></>}</h2>
        </div>
      </div>
      <div className="auth-panel">
        <Link to="/" className="cine-logo mb-14"><span className="cine-logo-mark">🃏</span> JESTER<em>studios</em></Link>
        {tone === "admin" && <p className="eyebrow mb-4"><span className="eyebrow-n">!</span><span className="eyebrow-line" />Restricted area</p>}
        <h1>{title}</h1>
        {subtitle && <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        <Link to="/" className="link-arrow mt-12 self-start text-sm">Back to the site <span>→</span></Link>
      </div>
    </div>
  );
}

export function Field({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-bold text-muted-foreground">{label}</span>
      <input {...props} className="w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-lg text-foreground outline-none transition focus:border-amber" />
    </label>
  );
}

export function SubmitBtn({ children, busy }: { children: ReactNode; busy?: boolean }) {
  return (
    <button type="submit" disabled={busy} className="mag-btn mag-solid w-full justify-center px-4 py-4 font-bold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary)] hover:brightness-125 disabled:opacity-60">
      <span className="mag-fill" aria-hidden="true" /><span className="mag-label">{busy ? "Please wait…" : children}</span>
    </button>
  );
}
