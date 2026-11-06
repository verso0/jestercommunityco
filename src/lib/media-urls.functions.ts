import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Signs storage paths for visitors, but only paths referenced by published rows. */
export const signPublishedPaths = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ paths: z.array(z.string().min(1).max(300)).max(200) }).parse(d))
  .handler(async ({ data }) => {
    if (data.paths.length === 0) return {} as Record<string, string>;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [m, v, t] = await Promise.all([
      supabaseAdmin.from("media").select("storage_path").eq("published", true).in("storage_path", data.paths),
      supabaseAdmin.from("videos").select("video_path, thumbnail_path").eq("published", true),
      supabaseAdmin.from("team_members").select("avatar_url").eq("published", true).in("avatar_url", data.paths.map((p) => `storage:${p}`)),
    ]);
    const allowed = new Set<string>();
    m.data?.forEach((r) => r.storage_path && allowed.add(r.storage_path));
    v.data?.forEach((r) => { if (r.video_path) allowed.add(r.video_path); if (r.thumbnail_path) allowed.add(r.thumbnail_path); });
    t.data?.forEach((r) => r.avatar_url && allowed.add(r.avatar_url.slice(8)));
    const ok = data.paths.filter((p) => allowed.has(p));
    if (ok.length === 0) return {} as Record<string, string>;
    const { data: signed } = await supabaseAdmin.storage.from("site-media").createSignedUrls(ok, 60 * 60 * 6);
    const out: Record<string, string> = {};
    signed?.forEach((s) => { if (s.signedUrl && s.path) out[s.path] = s.signedUrl; });
    return out;
  });
