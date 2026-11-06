import { Button } from "@/components/ui/button";
import { useEffect, useState, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BUCKET, safeFileName, validateFile } from "@/lib/site-data";

export function PageTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="admin-page-title mb-8">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      {desc && <p className="mt-2 max-w-2xl text-muted-foreground">{desc}</p>}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`admin-panel rounded-lg border border-border bg-surface p-5 ${className}`}>{children}</div>;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-amber ${props.className ?? ""}`} />;
}
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-amber ${props.className ?? ""}`} />;
}

export function Btn({ children, onClick, variant = "ghost", disabled, type = "button" }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "danger"; disabled?: boolean; type?: "button" | "submit" }) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:brightness-125",
    ghost: "border border-border text-foreground hover:border-foreground/40",
    danger: "border border-amber/50 text-amber hover:bg-amber/10",
  }[variant];
  return <Button variant="ghost" type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold disabled:opacity-50 ${v}`}>{children}</Button>;
}

export function StatusPill({ on }: { on: boolean }) {
  return <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${on ? "bg-foreground/15 text-foreground" : "bg-muted text-muted-foreground"}`}>{on ? "PUBLISHED" : "DRAFT"}</span>;
}

/** Validates then uploads to the private bucket; returns the storage path or null. */
export async function uploadFile(file: File, kind: "image" | "video", folder: string): Promise<string | null> {
  const err = await validateFile(file, kind);
  if (err) { toast.error(err); return null; }
  const path = safeFileName(file, folder);
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) { toast.error("Upload failed. Please try again."); return null; }
  return path;
}

export async function removeFile(path: string | null | undefined) {
  if (path) await supabase.storage.from(BUCKET).remove([path]);
}

/** Admin preview of a stored file or a plain URL. */
export function usePreviewUrl(url: string | null | undefined, path: string | null | undefined) {
  const [src, setSrc] = useState<string | null>(path ? null : url ?? null);
  useEffect(() => {
    let alive = true;
    if (!path) { setSrc(url ?? null); return; }
    supabase.storage.from(BUCKET).createSignedUrl(path, 3600).then(({ data }) => { if (alive) setSrc(data?.signedUrl ?? null); });
    return () => { alive = false; };
  }, [url, path]);
  return src;
}

export function FilePick({ label, accept, onFile }: { label: string; accept: string; onFile: (f: File) => void }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-sm font-bold hover:border-amber">
      {label}
      <input type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
    </label>
  );
}
