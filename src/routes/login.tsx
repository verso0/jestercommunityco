import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field, SubmitBtn } from "@/components/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Jester Studios" },
      { name: "description", content: "Sign in or create a Jester Studios account to follow Konnect Us." },
      { property: "og:title", content: "Sign in — Jester Studios" },
      { property: "og:description", content: "Sign in or create a Jester Studios account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const creds = z.object({ email: z.string().trim().email("Enter a valid email").max(255), password: z.string().min(8, "Password must be at least 8 characters").max(72) });

function LoginPage() {
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      if (mode === "forgot") {
        const p = z.string().trim().email().safeParse(email);
        if (!p.success) return setMsg({ ok: false, text: "Enter a valid email" });
        const { error } = await supabase.auth.resetPasswordForEmail(p.data, { redirectTo: `${window.location.origin}/reset-password` });
        setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "If that email has an account, a reset link is on its way." });
        return;
      }
      const p = creds.safeParse({ email, password });
      if (!p.success) return setMsg({ ok: false, text: p.error.issues[0]?.message ?? "Invalid input" });
      if (mode === "up") {
        const { error } = await supabase.auth.signUp({ ...p.data, options: { emailRedirectTo: window.location.origin } });
        setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Check your email to confirm your account, then sign in." });
      } else {
        const { error } = await supabase.auth.signInWithPassword(p.data);
        if (error) return setMsg({ ok: false, text: "Wrong email or password, or email not confirmed yet." });
        navigate({ to: "/" });
      }
    } finally {
      setBusy(false);
    }
  }

  const titles = { in: "Welcome back", up: "Join the crew", forgot: "Reset password" };
  return (
    <AuthShell title={titles[mode]} subtitle={mode === "forgot" ? "We'll email you a link to set a new password." : "No account needed to explore — signing in is optional."}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {mode !== "forgot" && <Field label="Password" type="password" autoComplete={mode === "up" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} required />}
        {msg && <p role="status" className={`text-sm ${msg.ok ? "text-foreground" : "text-amber"}`}>{msg.text}</p>}
        <SubmitBtn busy={busy}>{mode === "in" ? "Sign in" : mode === "up" ? "Create account" : "Send reset link"}</SubmitBtn>
      </form>
      <div className="mt-6 flex flex-wrap justify-between gap-2 text-sm text-muted-foreground">
        {mode !== "in" && <button onClick={() => setMode("in")} className="hover:text-foreground">Sign in instead</button>}
        {mode !== "up" && <button onClick={() => setMode("up")} className="hover:text-foreground">Create an account</button>}
        {mode !== "forgot" && <button onClick={() => setMode("forgot")} className="hover:text-foreground">Forgot password?</button>}
      </div>
      <p className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
        Team member? <Link to="/admin-login" className="font-bold text-amber hover:underline">Admin Login</Link>
      </p>
    </AuthShell>
  );
}
