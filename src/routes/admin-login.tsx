import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field, SubmitBtn } from "@/components/AuthShell";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Jester Studios" },
      { name: "description", content: "Restricted sign-in for Jester Studios administrators." },
      { property: "og:title", content: "Admin Login — Jester Studios" },
      { property: "og:description", content: "Restricted sign-in for Jester Studios administrators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

const schema = z.object({ email: z.string().trim().email().max(255), password: z.string().min(1).max(72) });

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    const p = schema.safeParse({ email, password });
    if (!p.success) return setErr("Enter your admin email and password.");
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword(p.data);
      if (error || !data.user) return setErr("Access denied. Check your email and password.");
      // Role is verified by the database, not by this page.
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      if (!isAdmin) {
        await supabase.auth.signOut();
        return setErr("This account does not have admin access.");
      }
      navigate({ to: "/admin" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell tone="admin" title="Admin Login" subtitle="Only authorized Jester Studios admins can enter.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Admin email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <p role="alert" className="glitch-text text-sm font-bold text-amber">{err}</p>}
        <SubmitBtn busy={busy}>Enter dashboard</SubmitBtn>
      </form>
    </AuthShell>
  );
}
