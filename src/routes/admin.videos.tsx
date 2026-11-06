import { studioHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Btn, FilePick, Input, PageTitle, Panel, StatusPill, Textarea, removeFile, uploadFile, usePreviewUrl } from "@/components/admin/ui";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/videos")({ head: () => studioHead("Videos and trailers", "Manage Jester Studios teaser and trailer releases."), component: VideosPage });

type Video = Tables<"videos">;

function VideosPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-videos"], queryFn: async () => (await supabase.from("videos").select("*").order("sort_order")).data ?? [] });
  const refresh = () => { void qc.invalidateQueries({ queryKey: ["admin-videos"] }); void qc.invalidateQueries({ queryKey: ["site-data"] }); };
  return (
    <>
      <PageTitle title="Videos & trailers" desc="Upload a teaser or trailer with a thumbnail, preview it, then publish. Unpublished slots show “Coming Soon” on the site. MP4, WEBM or MOV up to 200 MB." />
      <div className="grid gap-5 lg:grid-cols-3">{q.data?.map((v) => <VideoCard key={v.slot} v={v} onChange={refresh} />)}</div>
    </>
  );
}

function VideoCard({ v, onChange }: { v: Video; onChange: () => void }) {
  const video = usePreviewUrl(v.video_url, v.video_path);
  const thumb = usePreviewUrl(v.thumbnail_url, v.thumbnail_path);
  const [title, setTitle] = useState(v.title);
  const [description, setDescription] = useState(v.description);
  const [busy, setBusy] = useState(false);

  const update = async (patch: Partial<Video>, msg: string) => {
    setBusy(true);
    const { error } = await supabase.from("videos").update({ ...patch, updated_at: new Date().toISOString() }).eq("slot", v.slot);
    setBusy(false);
    if (error) toast.error("Save failed"); else { toast.success(msg); onChange(); }
  };
  const upload = async (file: File, kind: "video" | "image") => {
    setBusy(true);
    const path = await uploadFile(file, kind, `videos/${v.slot}`);
    setBusy(false);
    if (!path) return;
    const old = kind === "video" ? v.video_path : v.thumbnail_path;
    await update(kind === "video" ? { video_path: path, video_url: null } : { thumbnail_path: path, thumbnail_url: null }, kind === "video" ? "Video uploaded" : "Thumbnail uploaded");
    await removeFile(old);
  };
  const removeVideo = async () => {
    if (!confirm("Remove this video? The slot will show Coming Soon.")) return;
    await update({ video_path: null, video_url: null, thumbnail_path: null, thumbnail_url: null, published: false }, "Video removed");
    await removeFile(v.video_path);
    await removeFile(v.thumbnail_path);
  };

  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between"><h3 className="font-bold">{v.title}</h3><StatusPill on={v.published} /></div>
      <div className="overflow-hidden rounded-lg bg-background">
        {video ? <video src={video} poster={thumb ?? undefined} controls preload="metadata" className="aspect-video w-full" /> :
          thumb ? <img src={thumb} alt="" className="aspect-video w-full object-cover" /> :
          <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">No video yet</div>}
      </div>
      <div className="mt-3 space-y-2">
        <Input value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} />
        <Textarea rows={3} value={description} maxLength={2000} placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <FilePick label={v.video_path ? "Replace video" : "Upload video"} accept="video/mp4,video/webm,video/quicktime" onFile={(f) => void upload(f, "video")} />
        <FilePick label="Thumbnail" accept="image/jpeg,image/png,image/webp" onFile={(f) => void upload(f, "image")} />
        <Btn disabled={busy} onClick={() => void update({ title, description }, "Saved")}>Save</Btn>
        <Btn variant={v.published ? "ghost" : "primary"} disabled={busy || (!v.published && !v.video_path)} onClick={() => void update({ title, description, published: !v.published }, v.published ? "Unpublished" : "Published — live on the site")}>{v.published ? "Unpublish" : "Publish"}</Btn>
        {v.video_path && <Btn variant="danger" onClick={() => void removeVideo()}>Remove</Btn>}
      </div>
      {busy && <p className="mt-2 text-xs text-muted-foreground">Working… large videos can take a minute.</p>}
    </Panel>
  );
}
