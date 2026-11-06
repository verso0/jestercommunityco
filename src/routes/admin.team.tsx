import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, FilePick, Input, PageTitle, Panel, StatusPill, Textarea, removeFile, uploadFile, usePreviewUrl } from "@/components/admin/ui";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/team")({ component: TeamPage });

const SECTIONS = [
  { id: "founders", label: "Founders" },
  { id: "developers", label: "Developers" },
  { id: "social", label: "Social Media" },
  { id: "collaborators", label: "Ongoing Collaboration" },
] as const;
type Member = Tables<"team_members">;

function TeamPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-team"], queryFn: async () => (await supabase.from("team_members").select("*").order("sort_order")).data ?? [] });
  const refresh = () => { void qc.invalidateQueries({ queryKey: ["admin-team"] }); void qc.invalidateQueries({ queryKey: ["site-data"] }); };
  const add = async (section: string) => {
    const n = q.data?.filter((m) => m.section === section).length ?? 0;
    const { error } = await supabase.from("team_members").insert({ section, name: "NEW MEMBER", role: "", bio: "", sort_order: n, published: false });
    if (error) toast.error("Could not add"); else refresh();
  };
  return (
    <>
      <PageTitle title="Team" desc="Edit the team cards. New cards start as drafts until you publish them." />
      {SECTIONS.map((s) => {
        const items = q.data?.filter((m) => m.section === s.id) ?? [];
        return (
          <section key={s.id} className="mb-10">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">{s.label}</h2><Btn onClick={() => void add(s.id)}>+ Add member</Btn></div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((m, i) => <MemberCard key={m.id} m={m} prev={items[i - 1]} next={items[i + 1]} onChange={refresh} />)}
            </div>
          </section>
        );
      })}
    </>
  );
}

function MemberCard({ m, prev, next, onChange }: { m: Member; prev: Member | undefined; next: Member | undefined; onChange: () => void }) {
  const storagePath = m.avatar_url?.startsWith("storage:") ? m.avatar_url.slice(8) : null;
  const avatar = usePreviewUrl(storagePath ? null : m.avatar_url, storagePath);
  const [f, setF] = useState({ name: m.name, role: m.role, bio: m.bio });
  const update = async (patch: Partial<Member>, msg: string) => {
    const { error } = await supabase.from("team_members").update(patch).eq("id", m.id);
    if (error) toast.error("Save failed — name must be 1–40 characters"); else { toast.success(msg); onChange(); }
  };
  const swap = async (o?: Member) => {
    if (!o) return;
    await supabase.from("team_members").update({ sort_order: o.sort_order }).eq("id", m.id);
    await supabase.from("team_members").update({ sort_order: m.sort_order }).eq("id", o.id);
    onChange();
  };
  const photo = async (file: File) => {
    const path = await uploadFile(file, "image", "avatars");
    if (!path) return;
    await update({ avatar_url: `storage:${path}` }, "Photo updated");
    await removeFile(storagePath);
  };
  const del = async () => {
    if (!confirm(`Remove ${m.name}?`)) return;
    const { error } = await supabase.from("team_members").delete().eq("id", m.id);
    if (error) { toast.error("Delete failed"); return; }
    await removeFile(storagePath);
    onChange();
  };
  return (
    <Panel>
      <div className="mb-3 flex items-center gap-3">
        {avatar ? <img src={avatar} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-primary" /> : <div className="h-14 w-14 rounded-full bg-muted" />}
        <FilePick label="Photo" accept="image/jpeg,image/png,image/webp" onFile={(file) => void photo(file)} />
        <span className="ml-auto"><StatusPill on={m.published} /></span>
      </div>
      <div className="space-y-2">
        <Input value={f.name} maxLength={40} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Name" />
        <Input value={f.role} maxLength={120} onChange={(e) => setF({ ...f, role: e.target.value })} placeholder="Role" />
        <Textarea rows={3} value={f.bio} maxLength={600} onChange={(e) => setF({ ...f, bio: e.target.value })} placeholder="Bio" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => void update(f, "Saved")}>Save</Btn>
        <Btn variant={m.published ? "ghost" : "primary"} onClick={() => void update({ ...f, published: !m.published }, m.published ? "Hidden from site" : "Published")}>{m.published ? "Unpublish" : "Publish"}</Btn>
        <Btn onClick={() => void swap(prev)} disabled={!prev}><ArrowUp size={14} /></Btn>
        <Btn onClick={() => void swap(next)} disabled={!next}><ArrowDown size={14} /></Btn>
        <Btn variant="danger" onClick={() => void del()}><Trash2 size={14} /></Btn>
      </div>
    </Panel>
  );
}
