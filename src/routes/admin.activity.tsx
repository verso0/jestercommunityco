import { studioHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle, Panel } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/activity")({ head: () => studioHead("Activity log", "Review Jester Studios workspace changes."), component: Activity });

function Activity() {
  const q = useQuery({
    queryKey: ["admin-activity", 200],
    queryFn: async () => (await supabase.from("admin_activity").select("*").order("created_at", { ascending: false }).limit(200)).data ?? [],
  });
  return (
    <>
      <PageTitle title="Activity log" desc="Every change made in the dashboard is recorded automatically." />
      <Panel className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-muted-foreground"><tr><th className="py-2">When</th><th>Action</th><th>Area</th><th>Item</th><th>Admin</th></tr></thead>
          <tbody className="divide-y divide-border">
            {q.data?.map((a) => (
              <tr key={a.id}>
                <td className="py-2 pr-4 whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</td>
                <td className="pr-4 capitalize font-bold">{a.action}</td>
                <td className="pr-4">{a.target_table.replace("_", " ")}</td>
                <td className="pr-4 max-w-[180px] truncate text-muted-foreground">{a.target_id}</td>
                <td className="text-muted-foreground">{a.admin_id?.slice(0, 8) ?? "system"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!q.isLoading && !q.data?.length && <p className="py-4 text-sm text-muted-foreground">No activity yet.</p>}
      </Panel>
    </>
  );
}
