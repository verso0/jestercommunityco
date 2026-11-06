import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Type, Image, Film, Users, History, LogOut, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  // UX gate only — every write is enforced by database role policies.
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/admin-login" });
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
    if (!isAdmin) throw redirect({ to: "/admin-login" });
    return { adminEmail: data.user.email ?? "" };
  },
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Jester Studios" },
      { name: "description", content: "Manage Jester Studios site content, images, trailers and team." },
      { property: "og:title", content: "Admin Dashboard — Jester Studios" },
      { property: "og:description", content: "Manage Jester Studios site content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/content", label: "Site text", icon: Type },
  { to: "/admin/images", label: "Images", icon: Image },
  { to: "/admin/videos", label: "Videos", icon: Film },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/activity", label: "Activity", icon: History },
] as const;

function AdminLayout() {
  const { adminEmail } = Route.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const qc = useQueryClient();
  const navigate = useNavigate();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin-login", replace: true });
  }

  return (
    <div className="admin-shell min-h-screen bg-background md:flex">
      <aside className="border-b border-border bg-surface md:sticky md:top-0 md:h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between p-5">
          <Link to="/" className="font-display font-extrabold">🃏 Jester<span className="text-amber">.</span></Link>
          <span className="rounded bg-primary/30 px-2 py-0.5 text-[10px] font-bold text-amber">ADMIN</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/admin" ? path === "/admin" || path === "/admin/" : path.startsWith(to);
            return (
              <Link key={to} to={to} className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-bold transition ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Icon size={16} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden space-y-2 p-5 text-xs text-muted-foreground md:block md:absolute md:bottom-0 md:w-60">
          <p className="truncate">{adminEmail}</p>
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-foreground"><ExternalLink size={13} /> View live site</a>
          <button onClick={signOut} className="flex items-center gap-1.5 hover:text-amber"><LogOut size={13} /> Log out</button>
        </div>
      </aside>
      <main className="page-enter flex-1 p-5 md:p-10">
        <div className="mb-6 flex justify-end md:hidden">
          <button onClick={signOut} className="flex items-center gap-1.5 text-sm text-muted-foreground"><LogOut size={14} /> Log out</button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
