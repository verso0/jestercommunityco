import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, FilePick, Input, PageTitle, Panel, StatusPill, Textarea, removeFile, uploadFile, usePreviewUrl } from "@/components/admin/ui";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/images")({ component: ImagesPage });

const SECTIONS = [
  { id: "before", label: "Before the updates (also “Small Glimpse”)" },
  { id: "after", label: "After the updates" },
] as const;

type Media = Tables<"media">;

function ImagesPage() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => (await supabase.from("media").select("*").order("sort_order")).data ?? [],
  });
  const refresh = () => { void qc.invalidateQueries({ queryKey: ["admin-media"] }); void qc.invalidateQueries({ queryKey: ["site-data"] }); };

  async function add(section: string, file: File) {
    const path = await uploadFile(file, "image", section);
    if (!path) return;
    const list = q.data?.filter((m) => m.section === section) ?? [];
    const { error } = await supabase.from("media").insert({
      section, url: "", storage_path: path, file_name: file.name.slice(0, 120), file_type: file.type, file_size: file.size,
      caption: file.name.replace(/\.[^.]+$/, "").slice(0, 200), sort_order: list.length, published: false,
    });
    if (error) { await removeFile(path); toast.error("Could not save image"); } else { toast.success("Uploaded as draft — publish it when ready"); refresh(); }
  }

  return (
    <>
      <PageTitle title="Image library" desc="These pictures power the progress gallery, Small Glimpse and the Builds slider. JPG, PNG, WEBP or GIF up to 10 MB." />
      {SECTIONS.map((s) => {
        const items = q.data?.filter((m) => m.section === s.id) ?? [];
        return (
          <section key={s.id} className="mb-10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">{s.label} <span className="text-sm text-muted-foreground">({items.length})</span></h2>
              <FilePick label="+ Upload image" accept="image/jpeg,image/png,image/webp,image/gif" onFile={(f) => void add(s.id, f)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((m, i) => <MediaCard key={m.id} m={m} prev={items[i - 1]} next={items[i + 1]} onChange={refresh} />)}
            </div>
            {!items.length && !q.isLoading && <p className="text-sm text-muted-foreground">No images yet.</p>}
          </section>
        );
      })}
    </>
  );
}

function MediaCard({ m, prev, next, onChange }: { m: Media; prev: Media | undefined; next: Media | undefined; onChange: () => void }) {
  const src = usePreviewUrl(m.url, m.storage_path);
  const [caption, setCaption] = useState(m.caption);
  const [description, setDescription] = useState(m.description);
  const [busy, setBusy] = useState(false);

  const update = async (patch: Partial<Media>, msg: string) => {
    setBusy(true);
    const { error } = await supabase.from("media").update(patch).eq("id", m.id);
    setBusy(false);
    if (error) toast.error("Save failed"); else { toast.success(msg); onChange(); }
  };
  const swap = async (other?: Media) => {
    if (!other) return;
    await supabase.from("media").update({ sort_order: other.sort_order }).eq("id", m.id);
    await supabase.from("media").update({ sort_order: m.sort_order }).eq("id", other.id);
    onChange();
  };
  const replace = async (file: File) => {
    const path = await uploadFile(file, "image", m.section);
    if (!path) return;
    const old = m.storage_path;
    await update({ storage_path: path, url: "", file_name: file.name.slice(0, 120), file_type: file.type, file_size: file.size }, "Image replaced");
    await removeFile(old);
  };
  const del = async () => {
    if (!confirm("Delete this image permanently?")) return;
    const { error } = await supabase.from("media").delete().eq("id", m.id);
    if (error) { toast.error("Delete failed"); return; }
    await removeFile(m.storage_path);
    toast.success("Deleted");
    onChange();
  };

  return (
    <Panel>
      <div className="relative overflow-hidden rounded-lg bg-background">
        {src ? <img src={src} alt={m.caption} className="aspect-video w-full object-contain" loading="lazy" /> : <div className="aspect-video animate-pulse bg-muted" />}
        <div className="absolute left-2 top-2"><StatusPill on={m.published} /></div>
      </div>
      <div className="mt-3 space-y-2">
        <Input value={caption} maxLength={200} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" />
        <Textarea rows={3} value={description} maxLength={2000} onChange={(e) => setDescription(e.target.value)} placeholder="Description shown when the picture is opened" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn disabled={busy} onClick={() => void update({ caption, description }, "Saved")}>Save</Btn>
        <Btn variant={m.published ? "ghost" : "primary"} disabled={busy} onClick={() => void update({ published: !m.published, caption, description }, m.published ? "Unpublished" : "Published — live on the site")}>{m.published ? "Unpublish" : "Publish"}</Btn>
        <FilePick label="Replace" accept="image/jpeg,image/png,image/webp,image/gif" onFile={(f) => void replace(f)} />
        <Btn onClick={() => void swap(prev)} disabled={!prev}><ArrowUp size={14} /></Btn>
        <Btn onClick={() => void swap(next)} disabled={!next}><ArrowDown size={14} /></Btn>
        <Btn variant="danger" onClick={() => void del()}><Trash2 size={14} /></Btn>
      </div>
    </Panel>
  );
}
