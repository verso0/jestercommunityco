import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Btn, PageTitle, Panel, StatusPill, Textarea } from "@/components/admin/ui";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/content")({ component: ContentPage });

function ContentPage() {
  const q = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const [rows, drafts] = await Promise.all([
        supabase.from("site_content").select("*").order("key"),
        supabase.from("content_drafts").select("key, draft"),
      ]);
      const d = new Map((drafts.data ?? []).map((x) => [x.key, x.draft]));
      return (rows.data ?? []).map((row) => ({ ...row, draft: d.get(row.key) ?? row.published ?? "" }));
    },
  });
  return (
    <>
      <PageTitle title="Site text" desc="Edit a draft, preview it next to the live version, then publish. Older published versions can be restored." />
      <div className="space-y-5">
        {q.data?.map((row) => <ContentRow key={row.key} row={row} />)}
      </div>
    </>
  );
}

function ContentRow({ row }: { row: Tables<"site_content"> }) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState(row.draft);
  const [busy, setBusy] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  useEffect(() => setDraft(row.draft), [row.draft]);
  const versions = useQuery({
    queryKey: ["versions", row.key],
    enabled: showVersions,
    queryFn: async () => (await supabase.from("content_versions").select("*").eq("content_key", row.key).order("created_at", { ascending: false }).limit(10)).data ?? [],
  });

  const refresh = () => { void qc.invalidateQueries({ queryKey: ["admin-content"] }); void qc.invalidateQueries({ queryKey: ["site-data"] }); void qc.invalidateQueries({ queryKey: ["versions", row.key] }); };
  const run = async (fn: () => Promise<{ error: unknown }>, ok: string) => {
    setBusy(true);
    const { error } = await fn();
    setBusy(false);
    if (error) toast.error("Save failed"); else { toast.success(ok); refresh(); }
  };

  const saveDraft = () => run(async () => supabase.from("content_drafts").upsert({ key: row.key, draft: draft.slice(0, 5000), updated_at: new Date().toISOString() }), "Draft saved");
  const publish = () => run(async () => {
    if (row.published != null) await supabase.from("content_versions").insert({ content_key: row.key, value: row.published });
    await supabase.from("content_drafts").upsert({ key: row.key, draft: draft.slice(0, 5000) });
    return supabase.from("site_content").update({ published: draft.slice(0, 5000), published_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("key", row.key);
  }, "Published — live on the site");
  const unpublish = () => run(async () => supabase.from("site_content").update({ published: null }).eq("key", row.key), "Unpublished — site shows the default text");

  const changed = draft !== (row.published ?? "");
  return (
    <Panel>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold">{row.label || row.key}</h3>
        <StatusPill on={row.published != null} />
      </div>
      <Textarea rows={row.key === "progress_percent" ? 1 : 3} value={draft} maxLength={5000} onChange={(e) => setDraft(e.target.value)} />
      {changed && (
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-background p-3"><p className="mb-1 text-xs font-bold text-muted-foreground">LIVE NOW</p>{row.published ?? <i>Default text</i>}</div>
          <div className="rounded-lg border border-amber/40 bg-background p-3"><p className="mb-1 text-xs font-bold text-amber">PREVIEW</p>{draft}</div>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Btn onClick={saveDraft} disabled={busy}>Save draft</Btn>
        <Btn variant="primary" onClick={publish} disabled={busy || !draft.trim()}>Publish</Btn>
        {row.published != null && <Btn variant="danger" onClick={unpublish} disabled={busy}>Unpublish</Btn>}
        <Btn onClick={() => setShowVersions((s) => !s)}>{showVersions ? "Hide" : "Previous versions"}</Btn>
      </div>
      {showVersions && (
        <ul className="mt-3 space-y-2 text-sm">
          {versions.data?.length ? versions.data.map((v) => (
            <li key={v.id} className="flex items-start justify-between gap-3 rounded-lg bg-background p-3">
              <span><span className="text-xs text-muted-foreground">{new Date(v.created_at).toLocaleString()}</span><br />{v.value}</span>
              <Btn onClick={() => { setDraft(v.value); toast("Loaded into draft — publish to restore it"); }}>Restore</Btn>
            </li>
          )) : <li className="text-muted-foreground">No earlier versions yet.</li>}
        </ul>
      )}
    </Panel>
  );
}
