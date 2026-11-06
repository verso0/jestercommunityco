import { studioHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle, Panel } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/")({ head: () => studioHead("Overview", "Jester Studios workspace overview and recent activity."), component: Overview });

type Stats = { users: number; published_content: number; images: number; videos: number };

function Overview() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_stats");
      if (error) throw error;
      return data as unknown as Stats;
    },
  });
  const activity = useQuery({
    queryKey: ["admin-activity", 8],
    queryFn: async () => (await supabase.from("admin_activity").select("*").order("created_at", { ascending: false }).limit(8)).data ?? [],
  });

  const cards = [
    ["Registered users", stats.data?.users],
    ["Published text blocks", stats.data?.published_content],
    ["Images", stats.data?.images],
    ["Videos uploaded", stats.data?.videos],
  ] as const;

  return (
    <>
      <PageTitle title="Overview" desc="A quick look at what's on the site right now." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, n], i) => (
          <Panel key={label} className="reveal-stagger" >
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-4xl font-extrabold" style={{ animationDelay: `${i * 80}ms` }}>{stats.isLoading ? "…" : n ?? "—"}</p>
          </Panel>
        ))}
      </div>
      {stats.error && <p className="mt-4 text-sm text-amber">Could not load stats.</p>}
      <h2 className="mt-10 mb-4 text-xl font-bold">Recent activity</h2>
      <Panel>
        {activity.data?.length ? (
          <ul className="divide-y divide-border text-sm">
            {activity.data.map((a) => (
              <li key={a.id} className="flex justify-between gap-4 py-2.5">
                <span><b className="capitalize">{a.action}</b> in {a.target_table.replace("_", " ")}</span>
                <span className="text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">{activity.isLoading ? "Loading…" : "No changes yet."}</p>}
      </Panel>
    </>
  );
}
