import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const BUCKET = "site-media";

export type Shot = { src: string; caption: string; description: string };
export type Member = { name: string; role: string; bio: string; avatar?: string | null };
export type VideoSlot = { slot: string; title: string; description: string; videoUrl: string | null; thumbUrl: string | null; published: boolean };

export type SiteData = {
  content: Record<string, string>;
  before: Shot[];
  after: Shot[];
  team: Record<"founders" | "developers" | "social" | "collaborators", Member[]>;
  videos: VideoSlot[];
};

/** Turn stored references into displayable URLs. "storage:<path>" or a storage_path → signed URL. */
async function resolveAll(refs: (string | null | undefined)[]): Promise<Map<string, string>> {
  const paths = [...new Set(refs.filter((r): r is string => !!r && r.startsWith("storage:")).map((r) => r.slice(8)))];
  const map = new Map<string, string>();
  if (paths.length === 0) return map;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 6);
  data?.forEach((d) => { if (d.signedUrl && d.path) map.set(`storage:${d.path}`, d.signedUrl); });
  return map;
}

export async function fetchSiteData(): Promise<SiteData> {
  const [content, media, team, videos] = await Promise.all([
    supabase.from("site_content").select("key, published"),
    supabase.from("media").select("section, url, storage_path, caption, description, sort_order").eq("published", true).order("sort_order"),
    supabase.from("team_members").select("section, name, role, bio, avatar_url, sort_order").eq("published", true).order("sort_order"),
    supabase.from("videos").select("*").order("sort_order"),
  ]);
  if (content.error || media.error || team.error || videos.error) throw new Error("Could not load site data");

  const ref = (url: string, path: string | null) => (path ? `storage:${path}` : url);
  const urls = await resolveAll([
    ...media.data.map((m) => ref(m.url, m.storage_path)),
    ...team.data.map((t) => t.avatar_url),
    ...videos.data.flatMap((v) => [v.video_path ? `storage:${v.video_path}` : null, v.thumbnail_path ? `storage:${v.thumbnail_path}` : null]),
  ]);
  const u = (r: string | null | undefined) => (r ? urls.get(r) ?? (r.startsWith("storage:") ? null : r) : null);

  const shots = (section: string) =>
    media.data.filter((m) => m.section === section).map((m) => ({ src: u(ref(m.url, m.storage_path)) ?? "", caption: m.caption, description: m.description })).filter((s) => s.src);
  const members = (section: string) =>
    team.data.filter((t) => t.section === section).map((t) => ({ name: t.name, role: t.role, bio: t.bio, avatar: u(t.avatar_url) }));

  return {
    content: Object.fromEntries(content.data.filter((c) => c.published != null).map((c) => [c.key, c.published as string])),
    before: shots("before"),
    after: shots("after"),
    team: { founders: members("founders"), developers: members("developers"), social: members("social"), collaborators: members("collaborators") },
    videos: videos.data.map((v) => ({
      slot: v.slot, title: v.title, description: v.description, published: v.published,
      videoUrl: v.published ? u(v.video_path ? `storage:${v.video_path}` : v.video_url) : null,
      thumbUrl: v.published ? u(v.thumbnail_path ? `storage:${v.thumbnail_path}` : v.thumbnail_url) : null,
    })),
  };
}

export function useSiteData() {
  return useQuery({ queryKey: ["site-data"], queryFn: fetchSiteData, staleTime: 60_000 });
}

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const MAX_IMAGE = 10 * 1024 * 1024;
export const MAX_VIDEO = 200 * 1024 * 1024;

/** Validates type + size, then checks magic bytes so renamed files are rejected. */
export async function validateFile(file: File, kind: "image" | "video"): Promise<string | null> {
  const types = kind === "image" ? IMAGE_TYPES : VIDEO_TYPES;
  const max = kind === "image" ? MAX_IMAGE : MAX_VIDEO;
  if (!types.includes(file.type)) return `Only ${kind === "image" ? "JPG, PNG, WEBP or GIF" : "MP4, WEBM or MOV"} files are allowed.`;
  if (file.size > max) return `File is too large (max ${max / 1024 / 1024} MB).`;
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const hex = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  const ok = kind === "image"
    ? hex.startsWith("ffd8ff") || hex.startsWith("89504e47") || hex.startsWith("47494638") || (hex.startsWith("52494646") && hex.slice(16, 24) === "57454250")
    : hex.slice(8, 16) === "66747970" || hex.startsWith("1a45dfa3");
  return ok ? null : "This file's contents don't match its type.";
}

export function safeFileName(file: File, folder: string) {
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5);
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "file";
  return `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${base}.${ext}`;
}
