import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field, SubmitBtn } from "@/components/AuthShell";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Jester Studios" },
      { name: "description", content: "Choose a new password for your Jester Studios account." },
      { property: "og:title", content: "Set a new password — Jester Studios" },
      { property: "og:description", content: "Choose a new password for your Jester Studios account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (pw.length < 8) return setMsg("Password must be at least 8 characters.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setMsg("This reset link is invalid or expired. Request a new one.");
    navigate({ to: "/" });
  }

  return (
    <AuthShell title="Set a new password">
      <form onSubmit={submit} className="space-y-4">
        <Field label="New password" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        {msg && <p className="text-sm text-amber">{msg}</p>}
        <SubmitBtn busy={busy}>Save password</SubmitBtn>
      </form>
    </AuthShell>
  );
}
